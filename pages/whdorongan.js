import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import Header from '../components/Header';

export default function DashboardDorongan() {
  const [data, setData] = useState([]);
  const toast = useRef(null);

  // Fetch data untuk cutting dan sorting
  const fetchData = async () => {
    try {
      const cuttingResponse = await axios.get('/api/wh_cutting');
      const sortingResponse = await axios.get('/api/wh_sortir');



      const cuttingData = cuttingResponse.data;
      const sortingData = sortingResponse.data;
      console.log(cuttingResponse.data, sortingResponse.data); // Debugging data

      const result = cuttingData.map(cutting => {
        const relatedSorting = sortingData.filter(sorting => sorting.id_cutting === cutting.id);
        return relatedSorting.map(sorting => ({
          TGL_DORONG: cutting.date_cutting, // Mengambil tanggal cutting
          NAMA_ITEM: cutting.name, // Mengambil nama item
          KODE: sorting.id, // Mengambil kode dari sorting
          NAMA_TYPE: sorting.type_name, // Mengambil type_name dari sorting
          QTY: cutting.quantity - sorting.quantity, // Menghitung quantity
          NG: sorting.quantity, // Mengambil quantity dari sorting
          BON: sorting.bon, // Mengambil BON dari sorting
        }));
      }).flat(); // Mengflatten array hasil

     setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data.' });
    }
  };

  // Mengambil data saat komponen dimuat
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Header />
      <Toast ref={toast} />
      <h2>Dashboard Dorongan</h2>
      <DataTable value={data} paginator rows={10} header="Data Dorongan">
        <Column field="TGL_DORONG" header="TGL DORONG" />
        <Column field="NAMA_ITEM" header="NAMA ITEM" />
        <Column field="KODE" header="KODE" />
        <Column field="NAMA_TYPE" header="NAMA TYPE" />
        <Column field="QTY" header="QTY" />
        <Column field="NG" header="NG" />
        <Column field="BON" header="BON" />
      </DataTable>
    </div>
  );
}