import type { Booking, Car, RevenueEntry, Settings } from '../types'

const demoSettings: Settings = {
  id: 'demo-settings', business_name: 'NS Cars and Rentals', logo_url: null,
  phone: '85002 18518', whatsapp: null, email: null, address: null,
  city: 'Guntur, Andhra Pradesh', maps_url: 'https://maps.app.goo.gl/UzzX13CnHZfioN7a8',
  opening_hours: null, about: 'Demo preview. Business details can be edited after Supabase is connected.', social_links: {}
}

const demoCars: Car[] = [
  { id:'demo-car-1',brand:'Demo',model:'City Sedan',variant:'Comfort',year:2023,category:'Sedan',fuel_type:'Petrol',transmission:'Automatic',seats:5,ac:true,price:1800,price_unit:'day',description:'Sample vehicle for preview only.',features:['Air conditioning','Automatic'],availability:true,status:'active',images:[{id:'demo-image-1',car_id:'demo-car-1',image_url:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',storage_path:null}] },
  { id:'demo-car-2',brand:'Demo',model:'Family SUV',variant:'Touring',year:2022,category:'SUV',fuel_type:'Diesel',transmission:'Manual',seats:7,ac:true,price:2600,price_unit:'day',description:'Sample vehicle for preview only.',features:['Air conditioning','7 seats'],availability:false,status:'active',images:[{id:'demo-image-2',car_id:'demo-car-2',image_url:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=80',storage_path:null}] }
]

const demoBookings: Booking[] = [
  { id:'demo-booking-1',customer_name:'Demo Customer',phone:'0000000000',email:'customer@example.invalid',car_id:'demo-car-1',pickup_date:'2026-11-12',pickup_time:'10:00',return_date:'2026-11-14',return_time:'10:00',pickup_location:'Sample pickup location',message:'Sample request for demonstration.',status:'pending',created_at:'2026-10-06T09:30:00.000Z' },
  { id:'demo-booking-2',customer_name:'Sample Guest',phone:'0000000000',email:null,car_id:'demo-car-2',pickup_date:'2026-11-20',pickup_time:null,return_date:'2026-11-22',return_time:null,pickup_location:null,message:null,status:'confirmed',created_at:'2026-10-05T08:00:00.000Z' }
]
const demoRevenue: RevenueEntry[] = [
  {id:'demo-revenue-1',amount:3600,received_on:'2026-10-03',description:'Sample completed rental',created_at:'2026-10-03T12:00:00.000Z'},
  {id:'demo-revenue-2',amount:5200,received_on:'2026-10-06',description:'Sample rental payment',created_at:'2026-10-06T12:00:00.000Z'}
]

function read<T>(key:string, fallback:T):T { try { const value=localStorage.getItem(`ns-demo-${key}`); return value?JSON.parse(value) as T:fallback } catch { return fallback } }
function write<T>(key:string,value:T) { localStorage.setItem(`ns-demo-${key}`,JSON.stringify(value)); window.dispatchEvent(new Event('ns-demo-update')) }
export const getDemoCars=()=>read<Car[]>('cars',demoCars)
export const saveDemoCars=(cars:Car[])=>write('cars',cars)
export const getDemoBookings=()=>read<Booking[]>('bookings',demoBookings)
export const saveDemoBookings=(bookings:Booking[])=>write('bookings',bookings)
export const getDemoRevenue=()=>read<RevenueEntry[]>('revenue',demoRevenue)
export const saveDemoRevenue=(entries:RevenueEntry[])=>write('revenue',entries)
export const getDemoSettings=()=>read<Settings>('settings',demoSettings)
export const saveDemoSettings=(settings:Settings)=>write('settings',settings)
export const resetDemo=()=>{for(const key of ['cars','bookings','revenue','settings'])localStorage.removeItem(`ns-demo-${key}`);window.dispatchEvent(new Event('ns-demo-update'))}
