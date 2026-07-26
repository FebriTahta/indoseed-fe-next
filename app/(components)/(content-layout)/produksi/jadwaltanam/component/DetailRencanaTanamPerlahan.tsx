import { LahanKomoditas, RencanaTanamDetail } from "@/app/types/jadwalTanam";
import SpkLeaflet from "@/shared/@spk-reusable-components/spk-packages/spk-leaflet";
import FilePreview from "./FilePreview";
import Table from "@/app/(components)/myiamseed/Table";
import EditBtn from "./EditBtn";
import RemoveBtn from "./RemoveBtn";
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";

interface TableProps {
    data: RencanaTanamDetail[];
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export default function PetaLayoutCard({ data, onEdit, onDelete }: TableProps) {


  return (
    <>
      <div className="mt-6">
        <label className="mb-2 block font-semibold">Detail Rencana Tanam per Lahan</label>
        <div className="table-responsive">
          <table className="table whitespace-nowrap table-bordered min-w-full">
            <thead>
              <tr className="border-b border-defaultborder">
                <th scope="col" className="text-start">No</th>
                <th scope="col" className="text-start">Lahan</th>
                <th scope="col" className="text-start">Luas (Ha)</th>
                <th scope="col" className="text-start">Komoditas</th>
                <th scope="col" className="text-start">Varietas</th>
                <th scope="col" className="text-start">Tanggal Tanam</th>
                <th scope="col" className="text-start">Populasi Tanaman</th>
                <th scope="col" className="text-start">Sistem Irigasi</th>
                <th scope="col" className="text-start">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr className="border-b border-defaultborder" key={item.idLahan}>
                    <td>{index + 1}</td>
                    <td>{item.namaLahan}</td>
                    <td>{item.luasTanam}</td>
                    <td>{item.komoditas}</td>
                    <td>{item.varietas}</td>
                    <td>{item.tanggalTanam}</td>
                    <td>{item.populasiTanam}</td>
                    <td>{item.irigasi}</td>
                    <td>
                      <EditBtn id={item.id} onClick={onEdit} />
                      <RemoveBtn id={item.id} onClick={onDelete} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-muted">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
          <SpkButton buttontype="button" variant={`outline-success`} customClass={`ti-btn !me-0 `} disabled={undefined} style={undefined} Btnstyle={undefined} Role={undefined} Themevalue={undefined} Currentpage={undefined} Steppercomplete={undefined} Decremenet={undefined} Copymarkup={undefined} Increment={undefined} Togglepassword={undefined} Size={undefined} Stepperskip={undefined} Stepperreset={undefined} StepperBack={undefined} Stepperfinish={undefined} onclickfunc={undefined} Steppernext={undefined} removeelement={undefined} Overlayoptions={undefined} Id={undefined} Expand={undefined} Label={undefined} Collapse={undefined} Controls={undefined} Overlay={undefined} Tab={undefined} Overlayclose={undefined} >
            <i className="ri-add-large-line"></i>  Tambah Lahan
          </SpkButton>
        </div>
      </div>
    </>

  )
}

