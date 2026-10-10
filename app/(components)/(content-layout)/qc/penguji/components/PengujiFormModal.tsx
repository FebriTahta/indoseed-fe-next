"use client";

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import CrudModal from '@/app/(components)/(content-layout)/shared/CrudModal';
import ImageUpload from '@/app/(components)/(content-layout)/shared/ImageUpload';
import { iconButtonClass } from '@/app/(components)/(content-layout)/shared/buttonStyles';
import QcSelect from '../../shared/QcSelect';
import QcMultiSelect from '../../shared/QcMultiSelect';
import QcFileDropzone from '../../shared/QcFileDropzone';
import { useLaboratoriumOptions, useMetodeUjiOptions } from '@/app/hooks/useQcReference';
import { pengujiService } from '@/app/services/pengujiService';
import uploadService from '@/app/services/uploadService';
import { getErrorMessage, toDateInputValue } from '@/app/lib/format';
import { AkunPenguji, PENGUJI_STATUS, Penguji, PengujiPayload, PengujiStatus } from '@/app/types/penguji';

const STATUS_OPTIONS = PENGUJI_STATUS.map((s) => ({ value: s, label: s }));
const JENIS_SERTIFIKASI = ['ISTA', 'ISO 17025', 'KAN', 'Sertifikasi Internal'].map((s) => ({ value: s, label: s }));
const KETERANGAN_MAX = 200;
const FOTO_MAX_MB = 2;
const SERTIFIKAT_MAX_MB = 5;

interface FormValues {
  kodePenguji: string;
  nama: string;
  email: string;
  noTelepon: string;
  laboratoriumId: string;
  metodeUjiIds: string[];
  tanggalBergabung: string;
  berlakuHingga: string;
  status: PengujiStatus;
  keterangan: string;
  jenisSertifikasi: string;
  nomorSertifikat: string;
  tanggalSertifikat: string;
}

const toForm = (p?: Penguji | null): FormValues => {
  const sertifikasi = p?.sertifikasi?.[0];
  const date = (v?: string | null) => (v ? toDateInputValue(v) : '');
  return {
    kodePenguji: p?.kodePenguji ?? '',
    nama: p?.nama ?? '',
    email: p?.user?.email ?? '',
    noTelepon: p?.noTelepon ?? '',
    laboratoriumId: p?.laboratoriumId ?? '',
    metodeUjiIds: p?.metodeUji?.map((m) => m.testMethodId) ?? [],
    tanggalBergabung: p ? date(p.tanggalBergabung) : toDateInputValue(),
    berlakuHingga: date(p?.berlakuHingga),
    status: p?.status ?? 'Aktif',
    keterangan: p?.keterangan ?? '',
    jenisSertifikasi: sertifikasi?.namaSertifikasi ?? '',
    nomorSertifikat: sertifikasi?.nomorSertifikat ?? '',
    tanggalSertifikat: date(sertifikasi?.tanggalSertifikat),
  };
};

const Section = ({ no, title, children }: { no: number; title: string; children: React.ReactNode }) => (
  <section className="pt-1">
    <h6 className="flex items-center gap-2 text-sm font-semibold text-emerald-700 mb-3">
      <i className="ri-user-settings-line"></i> {no}. {title}
    </h6>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">{children}</div>
  </section>
);

const Field = ({
  label,
  htmlFor,
  required,
  error,
  hint,
  className = '',
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={className}>
    <label htmlFor={htmlFor} className="block text-xs font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
    {error ? <p className="text-xs text-rose-600 mt-1">{error}</p> : hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
  </div>
);

const inputClass = (invalid?: boolean) =>
  `form-control text-sm h-[38px] w-full ${invalid ? '!border-rose-400' : ''}`;

interface PengujiFormModalProps {
  isOpen: boolean;
  /** Penguji yang diedit; null = tambah baru. */
  penguji: Penguji | null;
  onClose: () => void;
  /** Dipanggil setelah tersimpan; `akun` terisi bila akun user baru dibuat. */
  onSaved: (akun: AkunPenguji | null) => void;
}

/** Form tambah / edit penguji. Saat tambah, backend otomatis membuatkan akun user ber-role penguji. */
export default function PengujiFormModal({ isOpen, penguji, onClose, onSaved }: PengujiFormModalProps) {
  const isEdit = Boolean(penguji);
  const { options: labOptions, loading: loadingLab } = useLaboratoriumOptions();
  const { options: metodeOptions, loading: loadingMetode } = useMetodeUjiOptions();
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [sertifikatFile, setSertifikatFile] = useState<File | null>(null);
  const [sertifikatUrl, setSertifikatUrl] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: toForm(null) });

  useEffect(() => {
    if (!isOpen) return;
    reset(toForm(penguji));
    setFotoFile(null);
    setFotoUrl(penguji?.foto ?? null);
    setSertifikatFile(null);
    setSertifikatUrl(penguji?.sertifikasi?.[0]?.lampiranUrl ?? null);
  }, [isOpen, penguji, reset]);

  const keteranganLength = watch('keterangan')?.length ?? 0;
  const tanggalBergabung = watch('tanggalBergabung');
  const jenisSertifikasi = watch('jenisSertifikasi');

  const upload = async (file: File, folder: string) => {
    const res = await uploadService.uploadFile(file, folder);
    if (!res.success || !res.data?.fileUrl) throw new Error('Gagal mengunggah file');
    return res.data.fileUrl;
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const [foto, lampiranUrl] = await Promise.all([
        fotoFile ? upload(fotoFile, 'penguji/foto') : Promise.resolve(fotoUrl),
        sertifikatFile ? upload(sertifikatFile, 'penguji/sertifikat') : Promise.resolve(sertifikatUrl),
      ]);
      const payload: PengujiPayload = {
        kodePenguji: values.kodePenguji.trim() || null,
        nama: values.nama.trim(),
        email: values.email.trim(),
        noTelepon: values.noTelepon.trim() || null,
        laboratoriumId: values.laboratoriumId,
        metodeUjiIds: values.metodeUjiIds,
        tanggalBergabung: values.tanggalBergabung,
        berlakuHingga: values.berlakuHingga || null,
        status: values.status,
        keterangan: values.keterangan.trim() || null,
        foto,
        sertifikasi: values.jenisSertifikasi
          ? {
              namaSertifikasi: values.jenisSertifikasi,
              nomorSertifikat: values.nomorSertifikat.trim() || null,
              tanggalSertifikat: values.tanggalSertifikat || null,
              lampiranUrl,
            }
          : null,
      };
      const res = penguji ? await pengujiService.update(penguji.id, payload) : await pengujiService.create(payload);
      toast.success(res.message || 'Data penguji tersimpan');
      onSaved(res.data.akun);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Gagal menyimpan data penguji'));
    }
  };

  return (
    <CrudModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Penguji' : 'Tambah Penguji'}
      onSubmit={handleSubmit(onSubmit)}
      submitText="Simpan"
      isLoading={isSubmitting}
      maxWidthClass="max-w-3xl"
    >
      <div className="space-y-6">
        <Section no={1} title="Informasi Penguji">
          <div className="space-y-4">
            <Field label="Kode Penguji" htmlFor="pg-kode" hint={isEdit ? 'Kode unik penguji' : 'Kosongkan untuk dibuat otomatis (PGJ-xxxx)'}>
              <input id="pg-kode" {...register('kodePenguji', { maxLength: 50 })} placeholder="Contoh: PGJ-0019" className={inputClass()} />
            </Field>
            <Field label="Nama Lengkap" htmlFor="pg-nama" required error={errors.nama?.message}>
              <input id="pg-nama" {...register('nama', { required: 'Nama lengkap wajib diisi', maxLength: { value: 191, message: 'Nama terlalu panjang' } })} placeholder="Masukkan nama lengkap" className={inputClass(!!errors.nama)} />
            </Field>
            <Field label="Laboratorium" htmlFor="pg-lab" required error={errors.laboratoriumId?.message}>
              <Controller
                name="laboratoriumId"
                control={control}
                rules={{ required: 'Laboratorium wajib dipilih' }}
                render={({ field }) => (
                  <QcSelect id="pg-lab" options={labOptions} value={field.value || null} onChange={(v) => field.onChange(v || '')} placeholder="Pilih laboratorium" isLoading={loadingLab} />
                )}
              />
            </Field>
            <Field label="Metode Uji yang Dikuasai" htmlFor="pg-metode" required error={errors.metodeUjiIds?.message} hint="Pilih satu atau lebih metode uji">
              <Controller
                name="metodeUjiIds"
                control={control}
                rules={{ validate: (v) => v.length > 0 || 'Pilih minimal satu metode uji' }}
                render={({ field }) => (
                  <QcMultiSelect id="pg-metode" options={metodeOptions} value={field.value} onChange={field.onChange} placeholder="Pilih metode uji" isLoading={loadingMetode} invalid={!!errors.metodeUjiIds} />
                )}
              />
            </Field>
          </div>
          <div className="space-y-4">
            <ImageUpload
              label="Foto Penguji"
              imageUrl={fotoUrl ?? undefined}
              accept="image/jpeg,image/png"
              maxSizeMb={FOTO_MAX_MB}
              hint={`Format JPG, PNG. Maks. ${FOTO_MAX_MB}MB`}
              onImageChange={(file) => {
                setFotoFile(file);
                if (!file) setFotoUrl(null);
              }}
            />
            <Field label="Email" htmlFor="pg-email" required error={errors.email?.message} hint={isEdit ? undefined : 'Dipakai untuk akun login penguji'}>
              <input
                id="pg-email"
                type="email"
                {...register('email', { required: 'Email wajib diisi', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid' } })}
                placeholder="Masukkan email"
                className={inputClass(!!errors.email)}
              />
            </Field>
            <Field label="No. Telepon" htmlFor="pg-telp" error={errors.noTelepon?.message}>
              <input
                id="pg-telp"
                type="tel"
                {...register('noTelepon', { pattern: { value: /^[0-9+\-\s()]{6,20}$/, message: 'Nomor telepon tidak valid' } })}
                placeholder="Masukkan nomor telepon"
                className={inputClass(!!errors.noTelepon)}
              />
            </Field>
          </div>
        </Section>

        <hr className="border-gray-100" />

        <Section no={2} title="Informasi Tambahan">
          <Field label="Tanggal Bergabung" htmlFor="pg-bergabung" required error={errors.tanggalBergabung?.message}>
            <input id="pg-bergabung" type="date" {...register('tanggalBergabung', { required: 'Tanggal bergabung wajib diisi' })} className={inputClass(!!errors.tanggalBergabung)} />
          </Field>
          <Field label="Berlaku Hingga" htmlFor="pg-berlaku" error={errors.berlakuHingga?.message}>
            <input
              id="pg-berlaku"
              type="date"
              min={tanggalBergabung || undefined}
              {...register('berlakuHingga', {
                validate: (v) => !v || !tanggalBergabung || v >= tanggalBergabung || 'Tidak boleh sebelum tanggal bergabung',
              })}
              className={inputClass(!!errors.berlakuHingga)}
            />
          </Field>
          <Field label="Status" htmlFor="pg-status" required hint="Penguji nonaktif tidak dapat login">
            <Controller
              name="status"
              control={control}
              render={({ field }) => <QcSelect id="pg-status" options={STATUS_OPTIONS} value={field.value} onChange={(v) => field.onChange((v as PengujiStatus) || 'Aktif')} />}
            />
          </Field>
          <Field label="Keterangan" htmlFor="pg-keterangan" error={errors.keterangan?.message}>
            <div className="relative">
              <textarea
                id="pg-keterangan"
                rows={3}
                maxLength={KETERANGAN_MAX}
                {...register('keterangan', { maxLength: { value: KETERANGAN_MAX, message: `Maksimal ${KETERANGAN_MAX} karakter` } })}
                placeholder="Masukkan keterangan (opsional)"
                className="form-control text-sm w-full pb-5"
              />
              <span className="absolute right-2 bottom-1.5 text-[10px] text-gray-400">
                {keteranganLength}/{KETERANGAN_MAX}
              </span>
            </div>
          </Field>
        </Section>

        <hr className="border-gray-100" />

        <Section no={3} title="Sertifikasi (Opsional)">
          <Field label="Jenis Sertifikasi" htmlFor="pg-jenis-sertifikasi" hint="Kosongkan bila penguji belum bersertifikat">
            <Controller
              name="jenisSertifikasi"
              control={control}
              render={({ field }) => (
                <QcSelect id="pg-jenis-sertifikasi" options={JENIS_SERTIFIKASI} value={field.value || null} onChange={(v) => field.onChange(v || '')} placeholder="Pilih jenis sertifikasi" isClearable />
              )}
            />
          </Field>
          <Field label="No. Sertifikat" htmlFor="pg-no-sertifikat">
            <input id="pg-no-sertifikat" {...register('nomorSertifikat')} placeholder="Masukkan nomor sertifikat" disabled={!jenisSertifikasi} className={inputClass()} />
          </Field>
          <Field label="Tanggal Sertifikat" htmlFor="pg-tgl-sertifikat">
            <input id="pg-tgl-sertifikat" type="date" {...register('tanggalSertifikat')} disabled={!jenisSertifikasi} className={inputClass()} />
          </Field>
          <Field label="Upload Sertifikat" htmlFor="pg-file-sertifikat" className="md:col-span-2">
            {sertifikatFile || sertifikatUrl ? (
              <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-3">
                <i className="ri-file-pdf-2-line text-2xl text-rose-500"></i>
                <div className="min-w-0 flex-1">
                  {sertifikatFile ? (
                    <p className="text-xs font-medium text-gray-800 truncate">{sertifikatFile.name}</p>
                  ) : (
                    <a href={sertifikatUrl!} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-emerald-700 hover:underline">
                      Lihat sertifikat tersimpan
                    </a>
                  )}
                  <p className="text-[11px] text-gray-400">{sertifikatFile ? 'Diunggah saat disimpan' : 'PDF'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSertifikatFile(null);
                    setSertifikatUrl(null);
                  }}
                  className={iconButtonClass('gray')}
                  title="Hapus file sertifikat"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            ) : (
              <QcFileDropzone
                compact
                accept=".pdf"
                maxSizeMb={SERTIFIKAT_MAX_MB}
                hint="Format PDF"
                disabled={!jenisSertifikasi}
                onSelect={setSertifikatFile}
              />
            )}
          </Field>
        </Section>
      </div>
    </CrudModal>
  );
}
