import { useEffect, useState, type FormEvent } from 'react'
import { ArrowRight, IndianRupee, Trash2 } from 'lucide-react'
import { demoMode, supabase } from './lib/supabase'
import { getDemoRevenue, saveDemoRevenue } from './lib/demo'
import type { RevenueEntry } from './types'

const formatMoney=(amount:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(amount)

export default function AdminRevenue(){
  const [entries,setEntries]=useState<RevenueEntry[]>([]),[error,setError]=useState(''),[busy,setBusy]=useState(false)
  const reload=()=>{if(demoMode){setEntries(getDemoRevenue());return}void supabase.from('revenue_entries').select('*').order('received_on',{ascending:false}).then(({data,error})=>{if(error)setError(error.message);else setEntries((data||[]) as RevenueEntry[])})}
  useEffect(()=>{reload();if(demoMode){window.addEventListener('ns-demo-update',reload);return()=>window.removeEventListener('ns-demo-update',reload)}},[])
  const total=entries.reduce((sum,entry)=>sum+Number(entry.amount),0)
  const month=new Date().toISOString().slice(0,7)
  const thisMonth=entries.filter(entry=>entry.received_on.startsWith(month)).reduce((sum,entry)=>sum+Number(entry.amount),0)
  const submit=async(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();const formElement=event.currentTarget;setBusy(true);setError('');const form=new FormData(formElement);const amount=Number(form.get('amount'));const received_on=String(form.get('received_on'));const description=String(form.get('description')||'').trim()||null
    if(demoMode){saveDemoRevenue([{id:crypto.randomUUID(),amount,received_on,description,created_at:new Date().toISOString()},...getDemoRevenue()]);formElement.reset();setBusy(false);reload();return}
    const {error}=await supabase.from('revenue_entries').insert({amount,received_on,description});setBusy(false);if(error)setError(error.message);else{formElement.reset();reload()}
  }
  const remove=async(entry:RevenueEntry)=>{if(!window.confirm('Delete this revenue entry?'))return;if(demoMode){saveDemoRevenue(getDemoRevenue().filter(item=>item.id!==entry.id));reload();return}const {error}=await supabase.from('revenue_entries').delete().eq('id',entry.id);if(error)setError(error.message);else reload()}
  return <><div className="admin-page-title"><div><div className="section-label"><span/> INCOME</div><h1>Revenue tracker</h1><p>Track payments actually received. Booking prices aren’t counted automatically.</p></div></div>
    <div className="stats-grid revenue-stats"><div className="stat-card"><div className="stat-icon"><IndianRupee size={17}/></div><span>Total recorded</span><b>{formatMoney(total)}</b></div><div className="stat-card"><div className="stat-icon"><IndianRupee size={17}/></div><span>Received this month</span><b>{formatMoney(thisMonth)}</b></div><div className="stat-card"><div className="stat-icon"><ArrowRight size={17}/></div><span>Entries</span><b>{entries.length}</b></div></div>
    {error&&<div className="form-error">{error}</div>}
    <form className="admin-form revenue-form" onSubmit={submit}><h2>Record a payment</h2><div className="form-grid"><label className="field"><span>Amount received (₹) *</span><input required name="amount" type="number" min="1" step="0.01" placeholder="0.00"/></label><label className="field"><span>Date received *</span><input required name="received_on" type="date" defaultValue={new Date().toISOString().slice(0,10)}/></label><label className="field field-full"><span>Note</span><input name="description" placeholder="Optional payment note"/></label></div><button className="button button-dark" disabled={busy}>{busy?'Saving…':'Add income'} <ArrowRight size={16}/></button></form>
    <section className="admin-section"><div className="admin-section-head"><div><h2>Recorded payments</h2><p>{demoMode?'Sample entries are for demonstration only.':'Only manually recorded payments are included.'}</p></div></div><div className="table-wrap"><table><thead><tr><th>Date</th><th>Note</th><th>Amount</th><th>Actions</th></tr></thead><tbody>{entries.map(entry=><tr key={entry.id}><td>{entry.received_on}</td><td>{entry.description||'—'}</td><td><b>{formatMoney(Number(entry.amount))}</b></td><td><button className="small-link danger" onClick={()=>void remove(entry)} aria-label="Delete revenue entry"><Trash2 size={15}/></button></td></tr>)}{!entries.length&&<tr><td colSpan={4} className="table-empty">No revenue entries yet. Record a payment to start tracking income.</td></tr>}</tbody></table></div></section>
  </>
}
