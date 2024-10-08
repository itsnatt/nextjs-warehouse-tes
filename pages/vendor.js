// pages/vendor.js
import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import axios from 'axios';
import Header from '../components/Header';

export default function Vendor() {
  const [vendors, setVendors] = useState([]);
  const [vendorDialog, setVendorDialog] = useState(false);
  const [vendor, setVendor] = useState({ id: '', name: '', address: '' });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    const response = await axios.get('/api/vendor');
    setVendors(response.data);
  };

  const openNew = () => {
    setVendor({ id: '', name: '', address: '' });
    setVendorDialog(true);
  };

  const hideDialog = () => {
    setVendorDialog(false);
  };

  const saveVendor = async () => {
    if (vendor.id) {
      await axios.put('/api/vendor', vendor);
    } else {
      await axios.post('/api/vendor', vendor);
    }
    setVendorDialog(false);
    fetchVendors();
  };

  const editVendor = (vendor) => {
    setVendor({ ...vendor });
    setVendorDialog(true);
  };

  const deleteVendor = async (id) => {
    await axios.delete('/api/vendor', { data: { id } });
    fetchVendors();
  };

  return (
    <div>
      <Header />
      <div className="p-grid">
      <Panel header="Header">

        <div className="p-col-12">
          <Button label="New Vendor" icon="pi pi-plus" onClick={openNew} />
          <DataTable value={vendors}>
            <Column field="id" header="ID"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="address" header="Address"></Column>
            <Column
              body={(rowData) => (
                <>
                  <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editVendor(rowData)} />
                  <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteVendor(rowData.id)} />
                </>
              )}
            />
          </DataTable>

          <Dialog visible={vendorDialog} onHide={hideDialog} header="Vendor Details">
            <div className="p-field">
              <label htmlFor="name">Name</label>
              <InputText id="name" value={vendor.name} onChange={(e) => setVendor({ ...vendor, name: e.target.value })} />
            </div>
            <div className="p-field">
              <label htmlFor="address">Address</label>
              <InputText id="address" value={vendor.address} onChange={(e) => setVendor({ ...vendor, address: e.target.value })} />
            </div>
            <Button label="Save" icon="pi pi-check" onClick={saveVendor} />
          </Dialog>
        </div>
        </Panel>
      </div>
    </div>
  );
}