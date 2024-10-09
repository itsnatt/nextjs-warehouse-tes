import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import Header from '../components/Header';

const MaterialPreview = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({});

  const fetchData = async () => {
    try {
      const rawMaterialsResponse = await axios.get('/api/raw_materials');
      const logMaterialsResponse = await axios.get('/api/log_raw_materials');
  
      const rawMaterials = rawMaterialsResponse.data;
      const logMaterials = logMaterialsResponse.data;
  
      // Proses data untuk mengisi tabel
      const processedData = rawMaterials.map((material) => {
        const { id, name, size } = material;
  
        // Ambil semua log untuk material ini
        const materialLogs = logMaterials.filter(log => log.id_material === id);
        
        // Hitung total barang masuk dan keluar dalam sebulan
        const incoming = materialLogs.reduce((acc, log) => acc + Number(log.item_in || 0), 0);
        const outgoing = materialLogs.reduce((acc, log) => acc + Number(log.item_out || 0), 0);
  
        // Hitung stok awal
        let initialStock = 0;
        if (materialLogs.length > 0) {
          const firstLog = materialLogs[0];
          initialStock = Number(firstLog.item_in || 0); // Gunakan barang masuk pertama
        }
  
        // Hitung stok akhir
        const currentStock = initialStock - outgoing + incoming;
  
        return {
          id,
          name,
          size,
          initialStock,
          incoming,
          outgoing,
          currentStock,
        };
      });
  
      setData(processedData);
      setChartData({
        labels: processedData.map(item => item.name),
        datasets: [
          {
            label: 'Barang Masuk',
            data: processedData.map(item => item.incoming),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
          {
            label: 'Barang Keluar',
            data: processedData.map(item => item.outgoing),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
         <Header />
      <h2>Preview Data Material</h2>
      <DataTable value={data} paginator rows={10} header="Material Preview">
        <Column field="id" header="NO" />
        <Column field="name" header="NAMA BAHAN" />
        <Column field="size" header="UKURAN ITEM" />
        <Column field="initialStock" header="STOK AWAL" />
        <Column field="incoming" header="BARANG MASUK" />
        <Column field="outgoing" header="BARANG KELUAR" />
        <Column field="currentStock" header="STOK AKHIR" />
      </DataTable>

      <h3>Grafik Barang Masuk dan Keluar</h3>
      <Chart type="bar" data={chartData} />
    </div>
  );
};

export default MaterialPreview;