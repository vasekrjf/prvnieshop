import React, { useState, useEffect } from "react";
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    updateDoc, 
    query, 
    orderBy,
    where, 
    writeBatch 
} from "firebase/firestore";
import { db } from "../firebase"; 
import Image from "next/image";

// Cloudinary konfigurace (Ujisti se, že sedí tvůj CLOUD_NAME)
const CLOUD_NAME = "dkpyxmr2k"; 
const UPLOAD_PRESET = "flower_storage"; 

const AdminPanel = ({ onLogout }) => {
    // --- STAVY: OBECNÉ ---
    const [activeTab, setActiveTab] = useState("content"); // 'content' nebo 'orders'

    // --- STAVY: SEKCE A KVĚTINY ---
    const [nazevSekce, setNazevSekce] = useState("");
    const [poradiSekce, setPoradiSekce] = useState(""); 
    const [kvetina, setKvetina] = useState({
        nazev: "",
        popis: "",
        cena: "",
        obrazek: null,
        sekce: ""
    });
    const [sekce, setSekce] = useState([]);
    const [kvetiny, setKvetiny] = useState([]);
    const [zprava, setZprava] = useState("");
    
    // Stavy pro editaci
    const [editKvetinaId, setEditKvetinaId] = useState(null);
    const [editKvetinaData, setEditKvetinaData] = useState({ 
        nazev: "", popis: "", cena: "", sekce: "", obrazek: null, urlObrazku: ""
    });
    const [editSekceId, setEditSekceId] = useState(null);
    const [editSekceData, setEditSekceData] = useState({ nazev: "", poradi: 0 });

    // --- STAVY: OBJEDNÁVKY ---
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [ordersError, setOrdersError] = useState(null);

    // =========================================================================
    // === 1. LOGIKA PRO SEKCE A KVĚTINY ===
    // =========================================================================

    const nactiSekce = async () => {
        try {
            const sectionsQuery = query(collection(db, "sections"), orderBy("order", "asc"), orderBy("name", "asc"));
            const querySnapshot = await getDocs(sectionsQuery);
            const sectionsArr = [];
            querySnapshot.forEach((doc) => sectionsArr.push({ id: doc.id, ...doc.data() }));
            
            const ceskeSekce = sectionsArr.map(s => ({
                id: s.id,
                nazev: s.name,
                poradi: s.order
            }));
            setSekce(ceskeSekce);
        } catch (err) {
            console.error("Chyba při načítání sekcí: ", err);
        }
    };

    const nactiKvetiny = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "flowers"));
            const flowersArr = [];
            querySnapshot.forEach((doc) => flowersArr.push({ id: doc.id, ...doc.data() }));
            
             const ceskeKvetiny = flowersArr.map(f => ({
                id: f.id,
                nazev: f.name,
                popis: f.description,
                cena: f.price,
                sekce: f.section,
                urlObrazku: f.imageUrl
            }));
            setKvetiny(ceskeKvetiny);
        } catch (err) {
            console.error("Chyba při načítání květin: ", err);
        }
    };

    const pridejSekci = async (e) => {
        e.preventDefault();
        setZprava("");
        if (!nazevSekce.trim()) return setZprava("Název sekce nesmí být prázdný.");
        
        const hodnotaPoradi = poradiSekce === "" ? 0 : Number(poradiSekce);
        
        try {
            const docRef = await addDoc(collection(db, "sections"), { name: nazevSekce, order: hodnotaPoradi });
            setSekce((prev) => [...prev, { id: docRef.id, nazev: nazevSekce, poradi: hodnotaPoradi }]);
            setNazevSekce("");
            setPoradiSekce(""); 
            setZprava(`Sekce "${nazevSekce}" přidána.`);
            nactiSekce(); 
        } catch (err) {
            setZprava("Chyba při přidávání sekce.");
        }
    };

    const aktualizujSekci = async (e) => {
        e.preventDefault();
        if (!editSekceId) return;
        try {
            const sectionRef = doc(db, "sections", editSekceId);
            await updateDoc(sectionRef, { name: editSekceData.nazev, order: Number(editSekceData.poradi) });
            setZprava("Sekce upravena.");
            setEditSekceId(null);
            nactiSekce(); 
        } catch (err) {
            setZprava("Chyba při úpravě sekce.");
        }
    };

    const smazSekci = async (id, nazevSekce) => {
        if (!window.confirm(`Opravdu smazat sekci "${nazevSekce}" a všechny její květiny?`)) return;
        try {
            const q = query(collection(db, "flowers"), where("section", "==", nazevSekce));
            const querySnapshot = await getDocs(q);
            const batch = writeBatch(db);
            
            querySnapshot.forEach((doc) => batch.delete(doc.ref));
            batch.delete(doc(db, "sections", id));
            await batch.commit();

            setSekce(sekce.filter((s) => s.id !== id));
            nactiKvetiny(); 
            setZprava("Sekce a květiny smazány.");
        } catch (err) {
            setZprava("Chyba při mazání.");
        }
    };

    const pridejKvetinu = async (e) => {
        e.preventDefault();
        setZprava("");
        if (!kvetina.obrazek || !kvetina.sekce) return setZprava("Vyplňte všechna pole a obrázek.");

        try {
            const formData = new FormData();
            formData.append("file", kvetina.obrazek);
            formData.append("upload_preset", UPLOAD_PRESET);
            
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
            const data = await res.json();
            
            if (!data.secure_url) return setZprava("Chyba nahrávání obrázku.");

            await addDoc(collection(db, "flowers"), {
                name: kvetina.nazev,
                description: kvetina.popis,
                price: kvetina.cena,
                imageUrl: data.secure_url,
                section: kvetina.sekce
            });

            setKvetina({ nazev: "", popis: "", cena: "", obrazek: null, sekce: "" });
            document.getElementById('flower-image-input').value = null; 
            setZprava("Květina přidána.");
            nactiKvetiny(); 
        } catch (err) {
            setZprava("Chyba při přidávání květiny.");
        }
    };

    const aktualizujKvetinu = async (e) => {
        e.preventDefault();
        if (!editKvetinaId) return;

        let url = editKvetinaData.urlObrazku;
        try {
            if (editKvetinaData.obrazek) {
                const formData = new FormData();
                formData.append("file", editKvetinaData.obrazek);
                formData.append("upload_preset", UPLOAD_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
                const data = await res.json();
                if (data.secure_url) url = data.secure_url;
            }

            await updateDoc(doc(db, "flowers", editKvetinaId), {
                name: editKvetinaData.nazev,
                description: editKvetinaData.popis,
                price: editKvetinaData.cena,
                imageUrl: url, 
                section: editKvetinaData.sekce
            });
            
            setEditKvetinaId(null);
            setZprava("Květina upravena.");
            nactiKvetiny(); 
        } catch (err) {
            setZprava("Chyba při úpravě.");
        }
    };

    const smazKvetinu = async (id) => {
        if (!window.confirm("Smazat květinu?")) return;
        try {
            await deleteDoc(doc(db, "flowers", id));
            setKvetiny(kvetiny.filter((k) => k.id !== id));
            setZprava("Květina smazána.");
        } catch (err) { setZprava("Chyba při mazání."); }
    };

    // Pomocné funkce pro editaci
    const zahajUpravuKvetiny = (k) => {
        setEditKvetinaId(k.id);
        setEditKvetinaData({ nazev: k.nazev, popis: k.popis, cena: k.cena, sekce: k.sekce, obrazek: null, urlObrazku: k.urlObrazku || "" });
        window.scrollTo(0,0);
    };
    const zahajUpravuSekce = (s) => {
        setEditSekceId(s.id);
        setEditSekceData({ nazev: s.nazev, poradi: s.poradi });
        window.scrollTo(0,0);
    };

    // =========================================================================
    // === 2. LOGIKA PRO OBJEDNÁVKY ===
    // =========================================================================

    const fetchOrders = async () => {
        setLoadingOrders(true);
        setOrdersError(null);
        try {
            const querySnapshot = await getDocs(collection(db, "orders"));
            const ordersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Řazení: Nejdříve nevyřízené (status 'new' nebo 'RECEIVED'), pak podle data
            ordersList.sort((a, b) => {
                const statusA = a.status || a.fulfillmentStatus;
                const statusB = b.status || b.fulfillmentStatus;
                
                // Pokud je status "new" nebo "RECEIVED", má přednost
                const isActiveA = statusA === 'new' || statusA === 'RECEIVED';
                const isActiveB = statusB === 'new' || statusB === 'RECEIVED';

                if (isActiveA && !isActiveB) return -1;
                if (!isActiveA && isActiveB) return 1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            setOrders(ordersList);
        } catch (err) {
            setOrdersError("Nepodařilo se načíst objednávky.");
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleUpdateStatus = async (orderId, currentStatus) => {
        // Podpora pro různé názvy statusů (status vs fulfillmentStatus)
        const isNew = currentStatus === 'new' || currentStatus === 'RECEIVED';
        const newStatus = isNew ? 'completed' : 'new'; // Přepínáme mezi 'new' a 'completed'

        try {
            await updateDoc(doc(db, "orders", orderId), { 
                status: newStatus,
                fulfillmentStatus: newStatus === 'new' ? 'RECEIVED' : 'FULFILLED' // Pro jistotu ukládáme obojí
            });
            
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, fulfillmentStatus: newStatus === 'new' ? 'RECEIVED' : 'FULFILLED' } : o));
        } catch (err) {
            alert("Chyba při změně stavu.");
        }
    };

    useEffect(() => {
        nactiSekce();
        nactiKvetiny();
        fetchOrders();
    }, []);

    // Helper pro bezpečný výpis ceny
    const formatCurrency = (amount) => {
        if (!amount) return "0 Kč";
        return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK' }).format(amount);
    };

    // =========================================================================
    // === RENDER ===
    // =========================================================================
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg min-h-screen">
            
            {/* HLAVIČKA */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-stone-800">Administrace Květinářství</h2>
                {onLogout && (
                    <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded shadow-md mt-4 sm:mt-0">
                        Odhlásit se
                    </button>
                )}
            </div>

            {/* NAVIGACE */}
            <div className="flex mb-8 gap-4 border-b border-stone-200">
                <button
                    onClick={() => setActiveTab("content")}
                    className={`pb-3 px-4 font-semibold text-lg border-b-2 transition-colors ${activeTab === "content" ? "border-green-600 text-green-700" : "border-transparent text-stone-500"}`}
                >
                    Produkty
                </button>
                <button
                    onClick={() => setActiveTab("orders")}
                    className={`pb-3 px-4 font-semibold text-lg border-b-2 transition-colors ${activeTab === "orders" ? "border-rose-600 text-rose-700" : "border-transparent text-stone-500"}`}
                >
                    Objednávky
                </button>
            </div>

            {/* ZPRÁVY */}
            {zprava && (
                <div className={`mb-4 p-3 rounded border ${zprava.includes("Chyba") ? "bg-red-100 text-red-700 border-red-300" : "bg-green-100 text-green-700 border-green-300"}`}>
                    {zprava}
                </div>
            )}

            {/* OBSAH: PRODUKTY */}
            {activeTab === "content" && (
                <div className="animate-fade-in">
                    {/* Sekce formuláře */}
                    {!editSekceId ? (
                        <form onSubmit={pridejSekci} className="mb-8 p-6 border rounded-lg bg-gray-50">
                            <h3 className="text-lg font-semibold mb-2">Přidat sekci</h3>
                            <div className="flex gap-4">
                                <input type="text" placeholder="Název" value={nazevSekce} onChange={e => setNazevSekce(e.target.value)} required className="border p-2 flex-grow rounded"/>
                                <input type="number" placeholder="Pořadí" value={poradiSekce} onChange={e => setPoradiSekce(e.target.value)} className="border p-2 w-24 rounded"/>
                                <button type="submit" className="bg-green-600 text-white px-4 rounded hover:bg-green-700">Přidat</button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={aktualizujSekci} className="mb-8 p-6 border-2 border-green-200 rounded-lg bg-green-50">
                            <h3 className="text-lg font-semibold mb-2 text-green-700">Upravit sekci</h3>
                            <div className="flex gap-4">
                                <input type="text" value={editSekceData.nazev} onChange={e => setEditSekceData({...editSekceData, nazev: e.target.value})} required className="border p-2 flex-grow rounded"/>
                                <input type="number" value={editSekceData.poradi} onChange={e => setEditSekceData({...editSekceData, poradi: e.target.value})} className="border p-2 w-24 rounded"/>
                                <button type="submit" className="bg-green-600 text-white px-4 rounded">Uložit</button>
                                <button type="button" onClick={() => setEditSekceId(null)} className="bg-gray-400 text-white px-4 rounded">Zrušit</button>
                            </div>
                        </form>
                    )}

                    {/* Seznam sekcí */}
                    <div className="mb-8 flex flex-wrap gap-2">
                        {sekce.map(s => (
                            <div key={s.id} className="bg-stone-200 px-3 py-1 rounded text-sm flex items-center gap-2">
                                <b>{s.poradi}</b> {s.nazev}
                                <button onClick={() => zahajUpravuSekce(s)} className="text-yellow-600 font-bold ml-2">✎</button>
                                <button onClick={() => smazSekci(s.id, s.nazev)} className="text-red-600 font-bold">✕</button>
                            </div>
                        ))}
                    </div>

                    <hr className="my-8"/>

                    {/* Květina formulář */}
                    {editKvetinaId ? (
                        <form onSubmit={aktualizujKvetinu} className="mb-8 p-6 border-2 border-blue-200 rounded-lg bg-white">
                            <h3 className="text-lg font-semibold mb-2 text-blue-700">Upravit květinu</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input type="text" placeholder="Název" value={editKvetinaData.nazev} onChange={e => setEditKvetinaData({...editKvetinaData, nazev: e.target.value})} required className="border p-2 rounded"/>
                                <input type="number" placeholder="Cena" value={editKvetinaData.cena} onChange={e => setEditKvetinaData({...editKvetinaData, cena: e.target.value})} required className="border p-2 rounded"/>
                                <select value={editKvetinaData.sekce} onChange={e => setEditKvetinaData({...editKvetinaData, sekce: e.target.value})} required className="border p-2 rounded">
                                    <option value="">Vyberte sekci</option>
                                    {sekce.map(s => <option key={s.id} value={s.nazev}>{s.nazev}</option>)}
                                </select>
                                <input type="file" onChange={e => setEditKvetinaData({...editKvetinaData, obrazek: e.target.files[0]})} className="border p-2 rounded"/>
                                <textarea placeholder="Popis" value={editKvetinaData.popis} onChange={e => setEditKvetinaData({...editKvetinaData, popis: e.target.value})} required className="border p-2 rounded col-span-1 sm:col-span-2"/>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Uložit změny</button>
                                <button type="button" onClick={() => setEditKvetinaId(null)} className="bg-gray-400 text-white px-4 py-2 rounded">Zrušit</button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={pridejKvetinu} className="mb-8 p-6 border rounded-lg bg-gray-50">
                            <h3 className="text-lg font-semibold mb-2">Přidat květinu</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input type="text" placeholder="Název" value={kvetina.nazev} onChange={e => setKvetina({...kvetina, nazev: e.target.value})} required className="border p-2 rounded"/>
                                <input type="number" placeholder="Cena" value={kvetina.cena} onChange={e => setKvetina({...kvetina, cena: e.target.value})} required className="border p-2 rounded"/>
                                <select value={kvetina.sekce} onChange={e => setKvetina({...kvetina, sekce: e.target.value})} required className="border p-2 rounded">
                                    <option value="">Vyberte sekci</option>
                                    {sekce.map(s => <option key={s.id} value={s.nazev}>{s.nazev}</option>)}
                                </select>
                                <input type="file" id="flower-image-input" onChange={e => setKvetina({...kvetina, obrazek: e.target.files[0]})} required className="border p-2 rounded"/>
                                <textarea placeholder="Popis" value={kvetina.popis} onChange={e => setKvetina({...kvetina, popis: e.target.value})} required className="border p-2 rounded col-span-1 sm:col-span-2"/>
                            </div>
                            <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Přidat květinu</button>
                        </form>
                    )}

                    {/* Seznam květin */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {kvetiny.map(k => (
                            <div key={k.id} className="border p-4 rounded shadow bg-white flex flex-col">
                                <div className="h-40 w-full relative mb-4">
                                    {k.urlObrazku ? <Image src={k.urlObrazku} fill className="object-cover rounded" alt={k.nazev}/> : <div className="w-full h-full bg-gray-200"/>}
                                </div>
                                <h3 className="font-bold text-lg">{k.nazev}</h3>
                                <p className="text-stone-500 text-sm mb-2">{k.sekce}</p>
                                <p className="font-bold text-lg mb-2">{k.cena} Kč</p>
                                <div className="mt-auto flex gap-2">
                                    <button onClick={() => zahajUpravuKvetiny(k)} className="bg-blue-600 text-white px-3 py-1 rounded flex-1">Upravit</button>
                                    <button onClick={() => smazKvetinu(k.id)} className="bg-red-500 text-white px-3 py-1 rounded flex-1">Smazat</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* OBSAH: OBJEDNÁVKY */}
            {activeTab === "orders" && (
                <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Seznam objednávek</h3>
                        <button onClick={fetchOrders} className="bg-gray-200 px-3 py-1 rounded text-sm">Obnovit</button>
                    </div>

                    {loadingOrders && <p>Načítání...</p>}
                    {ordersError && <p className="text-red-500">{ordersError}</p>}

                    {!loadingOrders && !ordersError && (
                        <div className="overflow-x-auto bg-white shadow rounded border">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Zákazník</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Položky</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Cena</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Stav</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Akce</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders.map(order => {
                                        // Zjistíme stav (podpora pro staré i nové názvosloví)
                                        const status = order.status || order.fulfillmentStatus;
                                        const isNew = status === 'new' || status === 'RECEIVED';

                                        return (
                                            <tr key={order.id} className={isNew ? "bg-rose-50" : "bg-white"}>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{order.customerName || "Neznámý"}</div>
                                                    <div className="text-xs text-gray-500">{order.customerEmail}</div>
                                                    <div className="text-xs text-gray-400 mt-1">ID: {order.id.substring(0,8)}...</div>
                                                </td>
                                                
                                                {/* --- TADY BYLA CHYBA: OPRAVENÝ VÝPIS POLOŽEK --- */}
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {Array.isArray(order.items) ? (
                                                        // Starý formát (pole objektů)
                                                        order.items.map((item, i) => (
                                                            <div key={i}>{item.name} <span className="text-gray-400">({item.quantity}x)</span></div>
                                                        ))
                                                    ) : (
                                                        // Nový formát ze Stripe (text oddělený čárkami)
                                                        order.items ? 
                                                            order.items.split(',').map((part, i) => <div key={i}>{part.trim()}</div>) 
                                                            : "Žádné položky"
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 font-bold text-gray-800">
                                                    {formatCurrency(order.amount || order.totalAmount)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2 py-1 text-xs rounded-full font-bold ${isNew ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                                                        {isNew ? "NOVÁ" : "HOTOVO"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button 
                                                        onClick={() => handleUpdateStatus(order.id, status)}
                                                        className={`text-white text-xs px-3 py-1 rounded ${isNew ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"}`}
                                                    >
                                                        {isNew ? "Dokončit" : "Vrátit zpět"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {orders.length === 0 && <p className="p-4 text-center text-gray-500">Žádné objednávky.</p>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;