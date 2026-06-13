/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FileText, ImageIcon, Loader2, Scale, ShieldCheck, Trash, Upload, X } from "lucide-react";
import { toast } from "sonner";

// Buat definisi contract Props agar bisa dikontrol dari file luar
interface SparePartModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  selectedPart?: any; // Data part jika modenya "edit"
  onClose: () => void;
  onSuccess: () => void; // Fungsi untuk refresh table utama jika sukses CRUD
}

export default function SparePartModalDialog({ isOpen, mode, selectedPart, onClose, onSuccess }: SparePartModalProps) {
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        part_number: "",
        category: "",
        price: 0,
        stock: 0,
        compatibility: "",
        image: [] as string[],
        description: "",   
        weight: "",        
        warranty: ""       
    });

    // Sinkronisasi data form setiap kali modal dibuka/diubah modenya
    useEffect(() => {
        if (isOpen) {
            if (mode === "edit" && selectedPart) {
                let imageArray: string[] = [];
                if (Array.isArray(selectedPart.image)) {
                    imageArray = selectedPart.image;
                } else if (typeof selectedPart.image === "string" && selectedPart.image !== "") {
                    imageArray = [selectedPart.image];
                }

                setFormData({ 
                    ...selectedPart,
                    image: imageArray,
                    description: selectedPart.description || "", 
                    weight: selectedPart.weight || "",           
                    warranty: selectedPart.warranty || ""         
                });
            } else {
                // Reset ke default jika mode "add"
                setFormData({ 
                    id: "", name: "", part_number: "", category: "Hidrolik", 
                    price: 0, stock: 0, compatibility: "", image: [],
                    description: "", weight: "", warranty: ""       
                });
            }
        }
    }, [isOpen, mode, selectedPart]);

    const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
    
        setUploading(true);
        const newUploadedUrls = [...formData.image];
    
        try {
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
            const filePath = `products/${fileName}`;
    
            const { error: uploadError } = await supabase.storage
              .from("spare-parts")
              .upload(filePath, file);
    
            if (uploadError) throw uploadError;
    
            const { data } = supabase.storage
              .from("spare-parts")
              .getPublicUrl(filePath);
    
            if (data?.publicUrl) {
              newUploadedUrls.push(data.publicUrl);
            }
          }
    
          setFormData(prev => ({ ...prev, image: newUploadedUrls }));
          toast.success(`${files.length} Gambar berhasil diunggah ke Storage!`);
        } catch (error: any) {
          toast.error(`Gagal mengunggah gambar: ${error.message}`);
        } finally {
          setUploading(false);
          e.target.value = "";
        }
    };

    const handleRemoveImageItem = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            image: prev.image.filter((_, idx) => idx !== indexToRemove)
        }));
        toast.warning("Gambar dihapus dari daftar.");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          if (mode === "add") {
            const { id, ...insertPayload } = formData; 
            const { error } = await supabase.from("spare_parts").insert([insertPayload]);
            if (error) throw error;
            toast.success("Suku cadang baru berhasil ditambahkan!");
          } else {
            const { error } = await supabase
              .from("spare_parts")
              .update({
                name: formData.name,
                part_number: formData.part_number,
                category: formData.category,
                price: formData.price,
                stock: formData.stock,
                compatibility: formData.compatibility,
                image: formData.image,
                description: formData.description, 
                weight: formData.weight,           
                warranty: formData.warranty         
              })
              .eq("id", formData.id);
            if (error) throw error;
            toast.success("Data suku cadang berhasil diperbarui!");
          }
          onSuccess(); // Picu refresh table di halaman utama
          onClose(); // Tutup modal
        } catch (error: any) {
          toast.error(`Gagal menyimpan data: ${error.message}`);
        }
    };

    if (!isOpen) return null; // Jika state isOpen false, modal tidak dirender

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-xl w-full overflow-hidden shadow-2xl max-h-[90vh] flex flex-col text-white">
                <div className="flex justify-between items-center bg-neutral-950/60 px-6 py-4 border-b border-neutral-800 shrink-0">
                <h2 className="text-sm font-bold uppercase tracking-wider text-yellow-500">
                    {mode === "add" ? "Tambah Suku Cadang Baru" : "Ubah Data Suku Cadang"}
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <X size={18} />
                </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-xs overflow-y-auto flex-1 global-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-slate-400 mb-1 font-medium">ID Kode Unit</label>
                    <input
                        type="text"
                        disabled
                        placeholder={mode === "add" ? "Dibuat Otomatis" : "ID Terkunci"}
                        value={mode === "edit" ? formData.id : ""}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-yellow-600 font-bold disabled:opacity-60 focus:outline-none cursor-not-allowed"
                    />
                    </div>
                    <div>
                    <label className="block text-slate-400 mb-1 font-medium">Part Number (P/N)</label>
                    <input
                        type="text"
                        required
                        placeholder="Contoh: 708-2L-00300"
                        value={formData.part_number}
                        onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-yellow-600/50"
                    />
                    </div>
                </div>

                <div>
                    <label className="block text-slate-400 mb-1 font-medium">Nama Komponen / Suku Cadang</label>
                    <input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap barang..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-yellow-600/50"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-slate-400 mb-1 font-medium">Kategori</label>
                    <input
                        type="text"
                        required
                        placeholder="Contoh: Hidrolik, Filter"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-yellow-600/50"
                    />
                    </div>
                    <div>
                    <label className="block text-slate-400 mb-1 font-medium">Jumlah Kuantitas Stok</label>
                    <input
                        type="number"
                        required
                        min={0}
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-yellow-600/50"
                    />
                    </div>
                </div>

                <div>
                    <label className="block text-slate-400 mb-1 font-medium">Estimasi Harga (IDR / Rupiah Mentah)</label>
                    <input
                    type="number"
                    required
                    min={0}
                    placeholder="Contoh: 450000"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white font-mono focus:outline-none focus:border-yellow-600/50"
                    />
                </div>

                <div>
                    <label className="block text-slate-400 mb-1 font-medium">Kesesuaian Unit / Kompatibilitas</label>
                    <input
                    type="text"
                    placeholder="Contoh: Excavator PC200-8"
                    value={formData.compatibility}
                    onChange={(e) => setFormData({ ...formData, compatibility: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-yellow-600/50"
                    />
                </div>

                <div className="border border-dashed border-neutral-800 bg-neutral-950/40 p-4 rounded-lg">
                    <label className="block text-slate-400 mb-2 font-medium flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-slate-500" /> Unggah Foto Produk (Bisa Pilih Banyak)
                    </label>
                    
                    <div className="flex items-center justify-center w-full mb-3">
                    <label className="w-full flex flex-col items-center px-4 py-4 bg-neutral-900 text-slate-400 rounded-lg border border-neutral-800 hover:border-yellow-600/40 cursor-pointer transition-all hover:text-slate-200">
                        {uploading ? (
                        <div className="flex items-center gap-2 py-1 text-xs text-yellow-600 font-medium">
                            <Loader2 className="animate-spin" size={16} />
                            <span>Sedang mengunggah file ke Supabase...</span>
                        </div>
                        ) : (
                        <div className="flex flex-col items-center gap-1">
                            <Upload size={18} className="text-yellow-600" />
                            <span className="text-[11px] tracking-wide">Klik untuk memilih beberapa gambar produk</span>
                        </div>
                        )}
                        <input
                        type="file"
                        multiple
                        accept="image/*"
                        disabled={uploading}
                        onChange={handleMultipleImagesUpload}
                        className="hidden"
                        />
                    </label>
                    </div>

                    {formData.image.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2 bg-neutral-900/50 p-2 rounded-md border border-neutral-900">
                        {formData.image.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-md overflow-hidden border border-neutral-800 group/img">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="Preview" className="object-cover w-full h-full" />
                            <button
                            type="button"
                            onClick={() => handleRemoveImageItem(idx)}
                            className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity text-white"
                            title="Hapus Gambar"
                            >
                            <Trash size={14} />
                            </button>
                        </div>
                        ))}
                    </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-slate-400 mb-1 font-medium flex items-center gap-1.5">
                        <Scale size={14} className="text-slate-500" /> Berat Estimasi (e.g. Kg/Gram)
                    </label>
                    <input
                        type="text"
                        placeholder="Contoh: 12.5 Kg atau 450 Gram"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-yellow-600/50"
                    />
                    </div>
                    <div>
                    <label className="block text-slate-400 mb-1 font-medium flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-slate-500" /> Masa Garansi Toko
                    </label>
                    <input
                        type="text"
                        placeholder="Contoh: 6 Bulan, 1 Tahun, atau No Warranty"
                        value={formData.warranty}
                        onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-yellow-600/50"
                    />
                    </div>
                </div>

                <div>
                    <label className="block text-slate-400 mb-1 font-medium flex items-center gap-1.5">
                    <FileText size={14} className="text-slate-500" /> Deskripsi Spesifikasi Suku Cadang
                    </label>
                    <textarea
                    rows={3}
                    placeholder="Tulis detail spesifikasi mekanis, nomor seri alternatif, atau instruksi kesesuaian unit..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-yellow-600/50 resize-none leading-relaxed"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-4 border-t border-neutral-800 pt-4">
                    <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 rounded text-slate-400 hover:text-white transition-colors"
                    >
                    Batal
                    </button>
                    <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-neutral-950 font-bold rounded transition-colors"
                    >
                    Simpan Data
                    </button>
                </div>
                </form>
            </div>
            </div>
    );
}