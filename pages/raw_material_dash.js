import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';

const MaterialPreview = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const months = Array.from({ length: 12 }, (_, i) => ({
    name: new Date(0, i).toLocaleString('default', { month: 'long' }),
    value: i + 1,
  }));

  const fetchData = async () => {
    try {
      const rawMaterialsResponse = await axios.get('/api/raw_materials');
      const logMaterialsResponse = await axios.get('/api/log_raw_materials');
  
      const rawMaterials = rawMaterialsResponse.data;
      const logMaterials = logMaterialsResponse.data;
  
      // Proses data untuk mengisi tabel
      const processedData = rawMaterials.map((material) => {
        const { id, name, size } = material;
  
        // Filter log berdasarkan bulan yang dipilih dan ID bahan
        const materialLogs = logMaterials.filter(log => {
          const logDate = new Date(log.date_in);
          return log.id_material === id && logDate.getMonth() + 1 === selectedMonth; // Bandingkan dengan bulan yang dipilih
        });
  
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
        let currentStock = initialStock;
        if (incoming > 0) {
          currentStock = initialStock - outgoing + incoming;
        }
  
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
      // Setup chart data
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
  }, [selectedMonth]); // Fetch data whenever the selected month changes

  return (
    <div>
      <h2>Preview Data Material</h2>
      <Dropdown
        value={selectedMonth}
        options={months}
        onChange={(e) => setSelectedMonth(e.value)}
        optionLabel="name"
        placeholder="Pilih Bulan"
      />
      <DataTable value={data} paginator rows={10} header="Material Preview">
        <Column field="id" header="NO" />
        <Column field="name" header="NAMA BAHAN" />
        <Column field="size" header="UKURAN ITEM" />
        <Column field="initialStock" header="STOK AWAL" />
        <Column field="incoming" header="BARANG MASUK" />
        <Column field="outgoing" header="BARANG KELUAR" />
        <Column field="currentStock" header="STOK AKHIR" />
      </DataTable>
    </div>
  );
};

export default MaterialPreview;