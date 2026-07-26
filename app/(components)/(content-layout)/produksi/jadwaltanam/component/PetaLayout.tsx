import { LahanKomoditas } from "@/app/types/jadwalTanam";
import SpkLeaflet from "@/shared/@spk-reusable-components/spk-packages/spk-leaflet";
import FilePreview from "./FilePreview";
import Table from "@/app/(components)/myiamseed/Table";

interface Props {
  value: LahanKomoditas;

  onChange: (
    field: keyof LahanKomoditas,
    value: string
  ) => void;
}


export default function PetaLayoutCard({
  value,
  onChange,
}: Props) {


  const position = [51.505, -0.09];
  const file = value.petaLahan ?? null;
  const fileName = file?.name ?? '-';
  const fileSize = file ? formatFileSize(file.size) : '-';
  const hasFile = !!file;

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  }

  const history: LahanKomoditas[] = [];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* File Layout */}
        <div>
          <label className="mb-2 block">Peta Lahan</label>

          <FilePreview
            fileName="fileName" fileSize="fileSize"
          />
        </div>

        {/* Map */}
        <div>
          <label className="mb-2 block">
            Layout Blok Lahan
          </label>

          <div id="map">
            <SpkLeaflet
              position={position}
              Zoom={13}
              scrollWheel={false}
              Customclass="mapleaflet ht-300"
              Id="leaflet1" Circlepostion={undefined} CirclepathOptions={undefined} MarkerpathOptions={undefined} PolylinepathOptions={undefined} Polyllinepositions={undefined} PolygonpathOptions={undefined} Polygonposition={undefined} ReactanglepathOptions={undefined} Bounds={undefined} MUltipolygonposition={undefined} Multipolyineposition={undefined} />
          </div>
        </div>



      </div>
      <div className="mt-6">
        <label className="mb-2 block font-semibold">Riwayat Penggunaan Lahan (3 Tahun Terakhir)</label>
        <div className="table-responsive">
          <table className="table whitespace-nowrap table-bordered min-w-full">
            <thead>
              <tr className="border-b border-defaultborder">
                <th scope="col" className="text-start">Tahun</th>
                <th scope="col" className="text-start">Komoditas</th>
                <th scope="col" className="text-start">Luas (Ha)</th>
                <th scope="col" className="text-start">Tanggal Tanam</th>
                <th scope="col" className="text-start">Tanggal Panen</th>
                <th scope="col" className="text-start">Hasil Produksi</th>
                <th scope="col" className="text-start">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((item, index) => (
                  <tr className="border-b border-defaultborder" key={item.idLahan}>
                    <td>{index + 1}</td>
                    <td>{item.komoditas}</td>
                    <td>{item.luasTanam}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-muted">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>

  )
}

