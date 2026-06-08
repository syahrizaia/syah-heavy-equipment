/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { X, RefreshCw } from "lucide-react";
import { fleetService } from "@/lib/fleet-service";

export default function FleetFormModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  editData, 
  triggerToast 
}: any) {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [formData, setFormData] = useState<any>({
    id: null, title: "", category: "", model: "", price: 0,
    status: "Active", health_score: 100, description: "", image_url: []
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
      const specsArray = editData.specs ? Object.entries(editData.specs).map(([k, v]) => ({ key: k, value: String(v) })) : [];
      setSpecs(specsArray.length ? specsArray : [{ key: "", value: "" }]);
    } else {
      resetLocalForm();
    }
  }, [editData]);

  const resetLocalForm = () => {
    setFormData({ id: null, title: "", category: "", model: "", price: 0, status: "Active", health_score: 100, description: "", image_url: [] });
    setSpecs([{ key: "power", value: "" }, { key: "weight", value: "" }, { key: "capacity", value: "" }]);
    setSelectedFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalUrls = Array.isArray(formData.image_url) ? formData.image_url : [];
      if (selectedFiles.length > 0) {
        const newUrls = await fleetService.uploadImages(selectedFiles);
        finalUrls = [...finalUrls, ...newUrls];
      }

      const specsObject = specs.reduce((acc: any, curr) => {
        if (curr.key) acc[curr.key.trim().toLowerCase()] = curr.value;
        return acc;
      }, {});

      const payload = { 
        ...formData, 
        image_url: finalUrls, 
        specs: specsObject,
        is_sold: formData.status === "Sold" 
      };
      if (!payload.id) delete payload.id;

      await fleetService.upsert(payload);
      triggerToast(formData.id ? "Berhasil diperbarui" : "Unit baru ditambahkan", "success");
      onSuccess();
      onClose();
    } catch (err: any) {
      triggerToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-start z-50 p-4 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl w-full max-w-lg space-y-4 my-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{formData.id ? "Edit" : "Tambah"} Unit</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white"><X size={20}/></button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Nama Unit</label>
            <input required className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded text-sm" 
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Kategori</label>
            <input required className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded text-sm" 
              value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Model</label>
            <input required className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded text-sm" 
              value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Harga (Rp)</label>
            <input type="number" className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded text-sm text-yellow-500 font-bold" 
              value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
          </div>
        </div>

        {/* ... (Lanjutkan sisa input: Status, Health, Specs, Desc, File) ... */}
        {/* Potongan kode specs dan file sama seperti sebelumnya, hanya ganti state ke formData/specs lokal */}

        <button disabled={loading} className="w-full bg-yellow-600 text-black py-3 rounded-lg font-bold uppercase text-sm mt-4">
          {loading ? <RefreshCw className="animate-spin mx-auto" size={20}/> : "Simpan Data"}
        </button>
      </form>
    </div>
  );
}