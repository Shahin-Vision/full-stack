import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SlidersHorizontal, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { RootState, AppDispatch } from '../store'
import { fetchProducts } from '../store/slices/productsSlice'
import ProductCard from '../components/ProductCard'

const COLORS = [
  { name:'Green',  hex:'#00C12B' },
  { name:'Red',    hex:'#F44336' },
  { name:'Yellow', hex:'#F4D03F' },
  { name:'Orange', hex:'#FF7800' },
  { name:'LBlue',  hex:'#35C1F1' },
  { name:'LPurple',hex:'#816BFF' },
  { name:'Pink',   hex:'#FF6B99' },
  { name:'White',  hex:'#FFFFFF' },
  { name:'Black',  hex:'#222222' },
  { name:'Beige',  hex:'#BEA9A9' },
  { name:'Gray',   hex:'#E4E4E4' },
  { name:'Navy',   hex:'#001F5B' },
]
const SIZES  = ['XX-Small','X-Small','Small','Medium','Large','X-Large','XX-Large','3X-Large','4X-Large']
const STYLES = ['casual','formal','party','gym']
const SORTS  = [
  { v:'-created_at', l:'Most Recent' },
  { v:'price',       l:'Price: Low → High' },
  { v:'-price',      l:'Price: High → Low' },
  { v:'-rating',     l:'Top Rated' },
]
const PAGE_SIZE = 9

export default function Shop() {
  const dispatch = useDispatch<AppDispatch>()
  const nav      = useNavigate()
  const [sp]     = useSearchParams()
  const { items, count, loading } = useSelector((s:RootState) => s.products)

  const [page,      setPage]      = useState(1)
  const [sort,      setSort]      = useState('-created_at')
  const [minPrice,  setMinPrice]  = useState(0)
  const [maxPrice,  setMaxPrice]  = useState(500)
  const [selColors, setSelColors] = useState<string[]>([])
  const [selSizes,  setSelSizes]  = useState<string[]>([])
  const [selStyles, setSelStyles] = useState<string[]>([])
  const [mobOpen,   setMobOpen]   = useState(false)
  const [open,      setOpen]      = useState({ style:true, price:true, colors:true, size:true })

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))
  const tog = (arr:string[], v:string) => arr.includes(v) ? arr.filter(x=>x!==v) : [...arr,v]

  const buildParams = useCallback((pg=page) => {
    const p: Record<string,any> = {
      page: pg, page_size: PAGE_SIZE, ordering: sort,
      min_price: minPrice, max_price: maxPrice,
    }
    if (sp.get('search'))           p.search  = sp.get('search')
    if (sp.get('sale')==='true')    p.is_sale = true
    if (sp.get('new')==='true')     p.is_new  = true
    if (sp.get('style'))            p.style   = sp.get('style')
    if (selStyles.length===1)       p.style   = selStyles[0]
    return p
  }, [page, sort, minPrice, maxPrice, selStyles, sp])

  useEffect(() => {
    setPage(1)
    dispatch(fetchProducts(buildParams(1)))
  }, [sp.toString(), sort])

  const applyFilters = () => {
    setPage(1)
    setMobOpen(false)
    dispatch(fetchProducts(buildParams(1)))
  }

  const goPage = (pg:number) => {
    if (pg<1||pg>totalPages) return
    setPage(pg)
    dispatch(fetchProducts(buildParams(pg)))
    window.scrollTo({ top:0, behavior:'smooth' })
  }

  const label = sp.get('search') ? `"${sp.get('search')}"`
    : sp.get('sale')==='true' ? 'On Sale'
    : sp.get('new')==='true' ? 'New Arrivals'
    : sp.get('style') ? sp.get('style')!.charAt(0).toUpperCase() + sp.get('style')!.slice(1)
    : sp.get('brands')==='true' ? 'Brands'
    : null

  const pageNums = () => {
    if (totalPages<=7) return [...Array(totalPages)].map((_,i)=>i+1)
    if (page<=4) return [1,2,3,4,5,'…',totalPages]
    if (page>=totalPages-3) return [1,'…',totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages]
    return [1,'…',page-1,page,page+1,'…',totalPages]
  }

  /* sidebar content shared between desktop+mobile */
  const Sidebar = () => (
    <div className="sidebar-box">
      <div className="sb-title">Filters <SlidersHorizontal size={16}/></div>

      {/* Style */}
      <div className="sb-sec">
        <div className="sb-sec-hd" onClick={()=>setOpen(o=>({...o,style:!o.style}))}>
          Dress Style {open.style ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
        </div>
        {open.style && STYLES.map(s=>(
          <div key={s} className="filter-row">
            <input type="checkbox" id={`st-${s}`}
              checked={selStyles.includes(s)}
              onChange={()=>setSelStyles(tog(selStyles,s))}/>
            <label htmlFor={`st-${s}`} style={{textTransform:'capitalize'}}>{s}</label>
          </div>
        ))}
      </div>

      {/* Price */}
      <div className="sb-sec">
        <div className="sb-sec-hd" onClick={()=>setOpen(o=>({...o,price:!o.price}))}>
          Price Range {open.price ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
        </div>
        {open.price && (
          <div className="price-range-wrap">
            <input type="range" className="price-slider" min={0} max={500} step={10}
              value={maxPrice} onChange={e=>setMaxPrice(+e.target.value)}/>
            <div className="price-labels">
              <span>$0</span><span>${maxPrice}</span>
            </div>
          </div>
        )}
      </div>

      {/* Colors */}
      <div className="sb-sec">
        <div className="sb-sec-hd" onClick={()=>setOpen(o=>({...o,colors:!o.colors}))}>
          Colors {open.colors ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
        </div>
        {open.colors && (
          <div className="color-dots">
            {COLORS.map(c=>(
              <div key={c.hex}
                className={`c-dot ${selColors.includes(c.hex)?'sel':''}`}
                style={{background:c.hex, border: c.hex==='#FFFFFF'||c.hex==='#E4E4E4' ? '1px solid #ccc' : undefined}}
                onClick={()=>setSelColors(tog(selColors,c.hex))}
                title={c.name}/>
            ))}
          </div>
        )}
      </div>

      {/* Size */}
      <div className="sb-sec">
        <div className="sb-sec-hd" onClick={()=>setOpen(o=>({...o,size:!o.size}))}>
          Size {open.size ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
        </div>
        {open.size && (
          <div className="sz-pills">
            {SIZES.map(s=>(
              <button key={s}
                className={`sz-pill ${selSizes.includes(s)?'sel':''}`}
                onClick={()=>setSelSizes(tog(selSizes,s))}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <button className="apply-btn" onClick={applyFilters}>Apply Filter</button>
    </div>
  )

  return (
    <div className="shop-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> {' '}›{' '}
        {label ? (<><Link to="/shop">Shop</Link>{' '}›{' '}<span>{label}</span></>) : <span>Shop</span>}
      </div>

      {/* Mobile overlay */}
      {mobOpen && (
        <div onClick={()=>setMobOpen(false)}
          style={{position:'fixed',inset:0,background:'rgba(0,0,0,.4)',zIndex:399}}/>
      )}
      {/* Mobile drawer */}
      <div style={{
        position:'fixed',top:0,left:mobOpen?0:-320,width:300,
        height:'100vh',zIndex:400,background:'#fff',padding:'20px',
        overflowY:'auto',transition:'left .3s ease',
        boxShadow:mobOpen?'4px 0 24px rgba(0,0,0,.15)':'none',
      }}>
        <button onClick={()=>setMobOpen(false)}
          style={{display:'flex',alignItems:'center',gap:6,marginBottom:16,fontSize:14,fontWeight:600}}>
          <X size={16}/> Close
        </button>
        <Sidebar/>
      </div>

      <div className="shop-layout">
        {/* Desktop sidebar */}
        <div className="sidebar"><Sidebar/></div>

        {/* Main */}
        <div className="shop-main">
          <div className="shop-top">
            <div>
              <div className="shop-count">
                {label||'All Products'}
                {!loading && <small> ({count} items)</small>}
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <button className="mob-filter-btn" onClick={()=>setMobOpen(true)}>
                <SlidersHorizontal size={15}/> Filters
              </button>
              <div className="sort-row">
                Sort by:&nbsp;
                <select value={sort} onChange={e=>{setSort(e.target.value);setPage(1)}}>
                  {SORTS.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="shop-grid">
              {[...Array(PAGE_SIZE)].map((_,i)=>(
                <div key={i}>
                  <div className="ske ske-img"/>
                  <div className="ske ske-txt" style={{marginTop:12}}/>
                  <div className="ske ske-txt ske-sm"/>
                </div>
              ))}
            </div>
          ) : items.length===0 ? (
            <div style={{padding:'80px 0',textAlign:'center',color:'#9F9F9F'}}>
              <div style={{fontSize:48,marginBottom:16}}>🔍</div>
              <p style={{fontSize:18,fontWeight:600}}>No products found</p>
              <p style={{marginTop:8}}>Try adjusting your filters.</p>
              <button onClick={()=>nav('/shop')} className="hero-btn" style={{marginTop:24,display:'inline-block'}}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="shop-grid">
              {items.map(p=><ProductCard key={p.id} product={p}/>)}
            </div>
          )}

          {/* Pagination */}
          {totalPages>1 && !loading && (
            <div className="pagination">
              <button className="pg-prev" onClick={()=>goPage(page-1)} disabled={page===1}>
                <ChevronLeft size={16}/> Previous
              </button>
              <div className="pg-nums">
                {pageNums().map((pg,i)=>
                  pg==='…' ? (
                    <span key={`d${i}`} style={{padding:'0 6px',color:'#9F9F9F'}}>…</span>
                  ) : (
                    <button key={pg} className={`pg-btn ${page===pg?'active':''}`}
                      onClick={()=>goPage(pg as number)}>{pg}</button>
                  )
                )}
              </div>
              <button className="pg-next" onClick={()=>goPage(page+1)} disabled={page===totalPages}>
                Next <ChevronRight size={16}/>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
