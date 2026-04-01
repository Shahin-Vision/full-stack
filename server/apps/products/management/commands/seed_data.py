import os, shutil, random
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.conf import settings
from apps.products.models import Product, Category, Review
from apps.users.models import User

IMG_MAP = {
    "gradient-tshirt": "gradient-graphic-tshirt.png",
    "polo-tipping": "polo-tipping.png",
    "black-striped-tshirt": "black-striped-tshirt.png",
    "skinny-jeans": "jeans-skinny-jeans.png",
    "checkered-shirt": "checkered-shirt.png",
    "sleeve-striped-tshirt": "sleeve-striped-t-shirt.png",
    "vertical-striped-shirt": "vertical-striped-shirt.png",
    "courage-graphic-tshirt": "courage-graphic-tshirt.png",
    "bermuda-shorts": "bermuda-shorts.png",
    "faded-skinny-jeans": "faded-skinny-jeans.png",
    "polo-contrast-trims": "polo-contrast-trims.png",
    "tshirt-tape-details": "tshirt-tape-details.png"
}

PRODUCTS = [
  # ── FIGMA HERO ──
  {"n":"Gradient Graphic T-Shirt","cat":"T-Shirts","price":145,"orig":None,"disc":0,"img":"gradient-tshirt","rating":3.5,"rc":145,"colors":["#4A4A4A","#2C3E50","#1A6B3C"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":True,"sale":False,"desc":"A bold gradient graphic tee featuring artistic typography."},
  {"n":"Polo with Tipping Details","cat":"Polo","price":180,"orig":None,"disc":0,"img":"polo-tipping","rating":4.5,"rc":80,"colors":["#FFFFFF","#2C3E50","#8B4513"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":True,"sale":False,"desc":"Classic piqué polo with contrasting tipping on collar and cuffs."},
  {"n":"Black Striped T-Shirt","cat":"T-Shirts","price":120,"orig":150,"disc":20,"img":"black-striped-tshirt","rating":5.0,"rc":220,"colors":["#000000","#FFFFFF","#808080"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":True,"sale":True,"desc":"Timeless black and white striped crew-neck tee."},
  {"n":"Skinny Fit Jeans","cat":"Jeans","price":240,"orig":260,"disc":8,"img":"skinny-jeans","rating":3.5,"rc":100,"colors":["#1A237E","#000000","#708090"],"sizes":["28","30","32","34","36"],"style":"casual","new":False,"sale":True,"desc":"Slim-cut stretch denim engineered for all-day comfort."},
  {"n":"Checkered Shirt","cat":"Shirts","price":180,"orig":None,"disc":0,"img":"checkered-shirt","rating":4.5,"rc":90,"colors":["#8B0000","#000080","#2F4F4F"],"sizes":["Small","Medium","Large","X-Large","XX-Large"],"style":"casual","new":True,"sale":False,"desc":"Relaxed-fit checkered shirt in soft brushed flannel."},
  {"n":"Sleeve Striped T-Shirt","cat":"T-Shirts","price":130,"orig":160,"disc":19,"img":"sleeve-striped-tshirt","rating":4.5,"rc":175,"colors":["#FFFFFF","#000000","#D2691E"],"sizes":["Small","Medium","Large","X-Large"],"style":"gym","new":False,"sale":True,"desc":"Moisture-wicking striped tee with contrast sleeve detail."},
  {"n":"Vertical Striped Shirt","cat":"Shirts","price":212,"orig":232,"disc":9,"img":"vertical-striped-shirt","rating":5.0,"rc":50,"colors":["#F5F5DC","#C0C0C0","#ADD8E6"],"sizes":["Small","Medium","Large","X-Large"],"style":"formal","new":False,"sale":True,"desc":"Smart vertical stripe dress shirt in premium cotton poplin."},
  {"n":"Courage Graphic T-Shirt","cat":"T-Shirts","price":145,"orig":None,"disc":0,"img":"gradient-tshirt","rating":4.0,"rc":60,"colors":["#808080","#000000","#FFFFFF"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":True,"sale":False,"desc":"Bold motivational graphic tee with statement typography."},
  {"n":"Loose Fit Bermuda Shorts","cat":"Shorts","price":80,"orig":None,"disc":0,"img":"skinny-jeans","rating":3.0,"rc":40,"colors":["#A0522D","#808080","#000000"],"sizes":["28","30","32","34"],"style":"gym","new":False,"sale":False,"desc":"Comfortable loose-fit shorts with side pockets."},
  {"n":"Faded Skinny Jeans","cat":"Jeans","price":210,"orig":None,"disc":0,"img":"skinny-jeans","rating":4.5,"rc":130,"colors":["#87CEEB","#708090","#000080"],"sizes":["28","30","32","34","36"],"style":"casual","new":False,"sale":False,"desc":"Fashion-forward faded denim with flattering slim silhouette."},
  {"n":"Polo with Contrast Trims","cat":"Polo","price":212,"orig":242,"disc":12,"img":"polo-tipping","rating":4.0,"rc":55,"colors":["#FFFFFF","#000000","#B22222"],"sizes":["Small","Medium","Large","X-Large"],"style":"formal","new":False,"sale":True,"desc":"Smart contrast-trim polo for golf course to office."},
  {"n":"One Life Graphic T-Shirt","cat":"T-Shirts","price":260,"orig":300,"disc":13,"img":"gradient-tshirt","rating":4.5,"rc":200,"colors":["#FFFFF0","#808080","#F0E68C"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":True,"desc":"Premium oversized graphic tee with artistic placement print."},
  # ── FORMAL ──
  {"n":"Classic Oxford Shirt","cat":"Shirts","price":195,"orig":None,"disc":0,"img":"vertical-striped-shirt","rating":4.8,"rc":88,"colors":["#FFFFFF","#87CEEB","#FFD700"],"sizes":["Small","Medium","Large","X-Large"],"style":"formal","new":False,"sale":False,"desc":"Crisp Oxford-weave shirt in traditional fit."},
  {"n":"Slim Chino Pants","cat":"Pants","price":220,"orig":250,"disc":12,"img":"skinny-jeans","rating":4.2,"rc":74,"colors":["#F5DEB3","#808080","#2F4F4F","#000000"],"sizes":["28","30","32","34","36"],"style":"formal","new":False,"sale":True,"desc":"Tailored slim chinos with comfortable stretch fabric."},
  {"n":"Linen Blazer","cat":"Jackets","price":380,"orig":450,"disc":16,"img":"vertical-striped-shirt","rating":4.6,"rc":42,"colors":["#F5F5DC","#808080","#000080"],"sizes":["Small","Medium","Large","X-Large"],"style":"formal","new":True,"sale":True,"desc":"Breathable linen blazer with relaxed structure."},
  {"n":"Pinstripe Dress Shirt","cat":"Shirts","price":165,"orig":None,"disc":0,"img":"vertical-striped-shirt","rating":4.3,"rc":61,"colors":["#FFFFFF","#ADD8E6","#E6E6FA"],"sizes":["Small","Medium","Large","X-Large"],"style":"formal","new":False,"sale":False,"desc":"Fine pinstripe pattern in premium cotton."},
  {"n":"Merino Wool Sweater","cat":"Sweaters","price":290,"orig":None,"disc":0,"img":"polo-tipping","rating":4.7,"rc":95,"colors":["#800000","#000080","#2F4F4F","#808080"],"sizes":["Small","Medium","Large","X-Large"],"style":"formal","new":False,"sale":False,"desc":"Ultra-soft 100% merino wool knit."},
  {"n":"Stretch Dress Pants","cat":"Pants","price":205,"orig":240,"disc":15,"img":"skinny-jeans","rating":4.5,"rc":84,"colors":["#000000","#808080","#000080"],"sizes":["28","30","32","34","36"],"style":"formal","new":False,"sale":True,"desc":"Wrinkle-resistant stretch dress pants."},
  {"n":"Tweed Blazer","cat":"Jackets","price":410,"orig":None,"disc":0,"img":"checkered-shirt","rating":4.7,"rc":38,"colors":["#808080","#D2B48C","#2F4F4F"],"sizes":["Small","Medium","Large","X-Large"],"style":"formal","new":False,"sale":False,"desc":"Heritage tweed blazer with notch lapels and patch pockets."},
  {"n":"Turtleneck Sweater","cat":"Sweaters","price":215,"orig":255,"disc":16,"img":"polo-tipping","rating":4.6,"rc":88,"colors":["#000000","#FFFFFF","#808080","#8B0000"],"sizes":["Small","Medium","Large","X-Large"],"style":"formal","new":False,"sale":True,"desc":"Elegant ribbed turtleneck for sophisticated monochrome look."},
  {"n":"V-Neck Cashmere Sweater","cat":"Sweaters","price":340,"orig":None,"disc":0,"img":"polo-tipping","rating":4.9,"rc":54,"colors":["#D2B48C","#808080","#000080"],"sizes":["Small","Medium","Large","X-Large"],"style":"formal","new":True,"sale":False,"desc":"Pure 2-ply cashmere V-neck."},
  {"n":"Trench Coat","cat":"Jackets","price":450,"orig":None,"disc":0,"img":"vertical-striped-shirt","rating":4.7,"rc":62,"colors":["#D2B48C","#000000","#808080"],"sizes":["Small","Medium","Large","X-Large"],"style":"formal","new":True,"sale":False,"desc":"Double-breasted trench coat with storm flap and D-ring belt."},
  {"n":"Linen Wide-Leg Trousers","cat":"Pants","price":200,"orig":None,"disc":0,"img":"skinny-jeans","rating":4.4,"rc":43,"colors":["#F5F5DC","#FFFFFF","#808080"],"sizes":["28","30","32","34"],"style":"formal","new":True,"sale":False,"desc":"Airy wide-leg linen trousers for warm-weather formal dressing."},
  # ── PARTY ──
  {"n":"Sequin Bomber Jacket","cat":"Jackets","price":420,"orig":520,"disc":19,"img":"checkered-shirt","rating":4.4,"rc":33,"colors":["#FFD700","#C0C0C0","#000000"],"sizes":["Small","Medium","Large","X-Large"],"style":"party","new":True,"sale":True,"desc":"Statement sequin bomber jacket that turns heads on the dance floor."},
  {"n":"Satin Shirt","cat":"Shirts","price":175,"orig":None,"disc":0,"img":"vertical-striped-shirt","rating":4.1,"rc":49,"colors":["#000000","#8B0000","#00008B"],"sizes":["Small","Medium","Large","X-Large"],"style":"party","new":True,"sale":False,"desc":"Glossy satin-finish shirt with a relaxed silhouette."},
  {"n":"Velvet Slim Trousers","cat":"Pants","price":260,"orig":310,"disc":16,"img":"skinny-jeans","rating":4.0,"rc":28,"colors":["#800080","#000080","#006400"],"sizes":["28","30","32","34"],"style":"party","new":False,"sale":True,"desc":"Rich velvet slim trousers for an opulent evening silhouette."},
  {"n":"Metallic Polo Shirt","cat":"Polo","price":195,"orig":None,"disc":0,"img":"polo-tipping","rating":3.8,"rc":21,"colors":["#C0C0C0","#FFD700","#CD7F32"],"sizes":["Small","Medium","Large","X-Large"],"style":"party","new":False,"sale":False,"desc":"Subtle metallic sheen polo that catches the light."},
  {"n":"Leather Biker Jacket","cat":"Jackets","price":520,"orig":620,"disc":16,"img":"checkered-shirt","rating":4.9,"rc":88,"colors":["#000000","#4A2C2A"],"sizes":["Small","Medium","Large","X-Large"],"style":"party","new":False,"sale":True,"desc":"Genuine full-grain leather biker jacket."},
  {"n":"Patterned Jacquard Shirt","cat":"Shirts","price":195,"orig":None,"disc":0,"img":"checkered-shirt","rating":4.0,"rc":29,"colors":["#000000","#8B0000","#000080"],"sizes":["Small","Medium","Large","X-Large"],"style":"party","new":False,"sale":False,"desc":"Luxe jacquard-woven shirt with intricate tonal pattern."},
  {"n":"Knitted Party Sweater","cat":"Sweaters","price":210,"orig":250,"disc":16,"img":"gradient-tshirt","rating":4.1,"rc":32,"colors":["#FFD700","#8B0000","#000080"],"sizes":["Small","Medium","Large","X-Large"],"style":"party","new":True,"sale":True,"desc":"Eye-catching knitted sweater with bold intarsia pattern."},
  {"n":"Printed Aloha Shirt","cat":"Shirts","price":140,"orig":170,"disc":18,"img":"checkered-shirt","rating":3.8,"rc":39,"colors":["#40E0D0","#FF7F50","#FFFFFF"],"sizes":["Small","Medium","Large","X-Large"],"style":"party","new":True,"sale":True,"desc":"Breezy aloha shirt with vivid tropical print."},
  {"n":"Cropped Denim Jacket","cat":"Jackets","price":245,"orig":None,"disc":0,"img":"checkered-shirt","rating":4.3,"rc":77,"colors":["#87CEEB","#000000"],"sizes":["Small","Medium","Large"],"style":"party","new":True,"sale":False,"desc":"Cropped denim jacket with raw edges and silver-tone hardware."},
  # ── GYM ──
  {"n":"Performance Dry-Fit Tee","cat":"T-Shirts","price":95,"orig":120,"disc":21,"img":"sleeve-striped-tshirt","rating":4.6,"rc":310,"colors":["#000000","#FFFFFF","#FF4500","#1E90FF"],"sizes":["Small","Medium","Large","X-Large"],"style":"gym","new":False,"sale":True,"desc":"Engineered quick-dry performance tee with mesh ventilation."},
  {"n":"Compression Joggers","cat":"Pants","price":140,"orig":None,"disc":0,"img":"skinny-jeans","rating":4.5,"rc":185,"colors":["#000000","#808080","#1E90FF"],"sizes":["Small","Medium","Large","X-Large"],"style":"gym","new":True,"sale":False,"desc":"4-way stretch compression joggers with zippered pockets."},
  {"n":"Athletic Hoodie","cat":"Hoodies","price":185,"orig":220,"disc":16,"img":"gradient-tshirt","rating":4.7,"rc":240,"colors":["#708090","#000000","#8B0000"],"sizes":["Small","Medium","Large","X-Large","XX-Large"],"style":"gym","new":False,"sale":True,"desc":"Fleece-lined pullover hoodie for warm-ups and cool-downs."},
  {"n":"Mesh Panel Shorts","cat":"Shorts","price":75,"orig":None,"disc":0,"img":"sleeve-striped-tshirt","rating":4.2,"rc":120,"colors":["#000000","#1E90FF","#FF4500"],"sizes":["Small","Medium","Large","X-Large"],"style":"gym","new":False,"sale":False,"desc":"Ventilated 5-inch inseam shorts with mesh panels."},
  {"n":"Zip-Up Track Jacket","cat":"Jackets","price":160,"orig":195,"disc":18,"img":"checkered-shirt","rating":4.4,"rc":98,"colors":["#000000","#FFFFFF","#1E90FF"],"sizes":["Small","Medium","Large","X-Large"],"style":"gym","new":True,"sale":True,"desc":"Lightweight full-zip track jacket with side pockets."},
  {"n":"Windbreaker","cat":"Jackets","price":210,"orig":None,"disc":0,"img":"sleeve-striped-tshirt","rating":4.3,"rc":145,"colors":["#1E90FF","#000000","#FFD700"],"sizes":["Small","Medium","Large","X-Large"],"style":"gym","new":True,"sale":False,"desc":"Packable windbreaker with hood and taped seams."},
  {"n":"Active Crop Hoodie","cat":"Hoodies","price":145,"orig":175,"disc":17,"img":"sleeve-striped-tshirt","rating":4.2,"rc":77,"colors":["#FF69B4","#FFFFFF","#000000"],"sizes":["Small","Medium","Large"],"style":"gym","new":True,"sale":True,"desc":"Cropped zip-up hoodie with thumbhole cuffs."},
  {"n":"Jogger Sweatpants","cat":"Pants","price":130,"orig":None,"disc":0,"img":"skinny-jeans","rating":4.5,"rc":198,"colors":["#808080","#000000","#1E90FF"],"sizes":["Small","Medium","Large","X-Large"],"style":"gym","new":False,"sale":False,"desc":"Tapered jogger sweatpants with elasticated waistband."},
  {"n":"Long-Sleeve Thermal Top","cat":"T-Shirts","price":115,"orig":140,"disc":18,"img":"black-striped-tshirt","rating":4.4,"rc":85,"colors":["#FFFFFF","#808080","#000000"],"sizes":["Small","Medium","Large","X-Large"],"style":"gym","new":False,"sale":True,"desc":"Midweight base-layer thermal long-sleeve."},
  {"n":"Fleece Vest","cat":"Jackets","price":120,"orig":145,"disc":17,"img":"gradient-tshirt","rating":4.2,"rc":61,"colors":["#808080","#000000","#556B2F"],"sizes":["Small","Medium","Large","X-Large"],"style":"gym","new":False,"sale":True,"desc":"Lightweight fleece vest ideal for layering."},
  {"n":"Swim Trunks","cat":"Shorts","price":70,"orig":90,"disc":22,"img":"sleeve-striped-tshirt","rating":4.0,"rc":56,"colors":["#1E90FF","#FF4500","#40E0D0"],"sizes":["Small","Medium","Large","X-Large"],"style":"gym","new":True,"sale":True,"desc":"Quick-dry swim trunks with mesh lining."},
  {"n":"Muscle Fit Crew Tee","cat":"T-Shirts","price":90,"orig":110,"disc":18,"img":"black-striped-tshirt","rating":4.3,"rc":99,"colors":["#000000","#FFFFFF","#1E90FF"],"sizes":["Small","Medium","Large","X-Large"],"style":"gym","new":False,"sale":True,"desc":"Body-hugging muscle-cut crew tee in moisture-wicking fabric."},
  {"n":"Performance Golf Polo","cat":"Polo","price":175,"orig":None,"disc":0,"img":"polo-tipping","rating":4.5,"rc":78,"colors":["#FFFFFF","#1E90FF","#FF4500"],"sizes":["Small","Medium","Large","X-Large"],"style":"gym","new":True,"sale":False,"desc":"UPF 50+ moisture-wicking golf polo."},
  {"n":"Jersey Track Pants","cat":"Pants","price":110,"orig":135,"disc":19,"img":"skinny-jeans","rating":4.0,"rc":66,"colors":["#000000","#808080","#FFFFFF"],"sizes":["Small","Medium","Large","X-Large"],"style":"gym","new":False,"sale":True,"desc":"Lightweight jersey track pants with woven side stripe."},
  # ── CASUAL EXTENDED ──
  {"n":"Abstract Print Oversized Tee","cat":"T-Shirts","price":135,"orig":None,"disc":0,"img":"gradient-tshirt","rating":4.0,"rc":67,"colors":["#FFFACD","#E0E0E0","#000000"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":True,"sale":False,"desc":"Oversized boxy tee with bold abstract print."},
  {"n":"Vintage Wash Graphic Tee","cat":"T-Shirts","price":110,"orig":140,"disc":21,"img":"gradient-tshirt","rating":4.3,"rc":88,"colors":["#D2B48C","#808080","#FFFFFF"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":True,"desc":"Worn-in vintage wash graphic tee with retro distressed print."},
  {"n":"Tie-Dye Crew Neck Tee","cat":"T-Shirts","price":115,"orig":None,"disc":0,"img":"sleeve-striped-tshirt","rating":3.9,"rc":45,"colors":["#FF69B4","#40E0D0","#9370DB"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":True,"sale":False,"desc":"Hand-dyed tie-dye pattern on soft 100% cotton jersey."},
  {"n":"Longline Plain Tee","cat":"T-Shirts","price":98,"orig":None,"disc":0,"img":"black-striped-tshirt","rating":4.1,"rc":52,"colors":["#000000","#FFFFFF","#808080","#000080"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":False,"desc":"Extended-length plain tee in a relaxed fit."},
  {"n":"Henley Button T-Shirt","cat":"T-Shirts","price":125,"orig":145,"disc":14,"img":"polo-tipping","rating":4.4,"rc":110,"colors":["#FFFFFF","#000000","#808080","#8B4513"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":True,"desc":"Classic henley with three-button placket."},
  {"n":"Raglan Baseball Tee","cat":"T-Shirts","price":105,"orig":None,"disc":0,"img":"sleeve-striped-tshirt","rating":4.1,"rc":64,"colors":["#FFFFFF","#808080","#000000"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":True,"sale":False,"desc":"Classic raglan 3/4 sleeve baseball tee with contrast sleeves."},
  {"n":"Waffle Knit Henley","cat":"T-Shirts","price":130,"orig":None,"disc":0,"img":"polo-tipping","rating":4.6,"rc":82,"colors":["#D2B48C","#808080","#FFFFFF","#000000"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":False,"desc":"Textured waffle-knit henley with relaxed comfortable fit."},
  {"n":"Straight-Leg Jeans","cat":"Jeans","price":230,"orig":None,"disc":0,"img":"skinny-jeans","rating":4.6,"rc":143,"colors":["#1A237E","#000000","#708090"],"sizes":["28","30","32","34","36"],"style":"casual","new":False,"sale":False,"desc":"Timeless straight-leg cut in rigid selvedge-inspired denim."},
  {"n":"Ripped Slim Jeans","cat":"Jeans","price":215,"orig":260,"disc":17,"img":"skinny-jeans","rating":4.2,"rc":78,"colors":["#87CEEB","#000000"],"sizes":["28","30","32","34"],"style":"casual","new":True,"sale":True,"desc":"On-trend distressed jeans with strategic rips at the knees."},
  {"n":"Cargo Trousers","cat":"Pants","price":175,"orig":None,"disc":0,"img":"skinny-jeans","rating":4.3,"rc":92,"colors":["#556B2F","#000000","#8B7355"],"sizes":["28","30","32","34","36"],"style":"casual","new":False,"sale":False,"desc":"Multi-pocket cargo pants with relaxed tapered fit."},
  {"n":"Wide-Leg Denim","cat":"Jeans","price":245,"orig":280,"disc":13,"img":"skinny-jeans","rating":4.0,"rc":35,"colors":["#1A237E","#708090"],"sizes":["28","30","32","34"],"style":"casual","new":True,"sale":True,"desc":"Flowy wide-leg denim with high-rise waist."},
  {"n":"Corduroy Trousers","cat":"Pants","price":190,"orig":None,"disc":0,"img":"skinny-jeans","rating":4.5,"rc":60,"colors":["#8B4513","#556B2F","#708090"],"sizes":["28","30","32","34","36"],"style":"casual","new":False,"sale":False,"desc":"Fine-wale corduroy trousers with straight relaxed leg."},
  {"n":"Hawaiian Print Shirt","cat":"Shirts","price":155,"orig":None,"disc":0,"img":"checkered-shirt","rating":4.1,"rc":73,"colors":["#FF7F50","#40E0D0","#FFD700"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":True,"sale":False,"desc":"Vibrant Hawaiian-print camp collar shirt."},
  {"n":"Denim Shirt Jacket","cat":"Jackets","price":265,"orig":310,"disc":15,"img":"checkered-shirt","rating":4.4,"rc":115,"colors":["#87CEEB","#1A237E","#000000"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":True,"desc":"Versatile denim shirt-jacket for top or lightweight layer."},
  {"n":"Flannel Plaid Shirt","cat":"Shirts","price":160,"orig":185,"disc":14,"img":"checkered-shirt","rating":4.5,"rc":134,"colors":["#8B0000","#000080","#006400"],"sizes":["Small","Medium","Large","X-Large","XX-Large"],"style":"casual","new":False,"sale":True,"desc":"Brushed flannel plaid shirt in oversized relaxed fit."},
  {"n":"Linen Short-Sleeve Shirt","cat":"Shirts","price":145,"orig":None,"disc":0,"img":"vertical-striped-shirt","rating":4.3,"rc":67,"colors":["#FFFFFF","#F5DEB3","#ADD8E6"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":True,"sale":False,"desc":"100% breathable linen short-sleeve shirt."},
  {"n":"Classic Pullover Hoodie","cat":"Hoodies","price":165,"orig":None,"disc":0,"img":"gradient-tshirt","rating":4.7,"rc":290,"colors":["#808080","#000000","#8B0000","#000080"],"sizes":["Small","Medium","Large","X-Large","XX-Large"],"style":"casual","new":False,"sale":False,"desc":"Cosy heavyweight pullover hoodie in relaxed fit."},
  {"n":"Zip-Up Hoodie","cat":"Hoodies","price":185,"orig":210,"disc":12,"img":"gradient-tshirt","rating":4.5,"rc":175,"colors":["#000000","#808080","#1E90FF"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":True,"desc":"Full zip-up fleece hoodie with clean silhouette."},
  {"n":"Crewneck Sweatshirt","cat":"Sweaters","price":140,"orig":None,"disc":0,"img":"sleeve-striped-tshirt","rating":4.4,"rc":155,"colors":["#FFFFFF","#808080","#000000","#D2691E"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":True,"sale":False,"desc":"400gsm heavyweight crewneck sweatshirt in relaxed fit."},
  {"n":"Graphic Print Hoodie","cat":"Hoodies","price":195,"orig":230,"disc":15,"img":"gradient-tshirt","rating":4.2,"rc":88,"colors":["#000000","#FFFFFF"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":True,"sale":True,"desc":"Premium heavyweight hoodie with large back graphic print."},
  {"n":"Classic Pique Polo","cat":"Polo","price":155,"orig":None,"disc":0,"img":"polo-tipping","rating":4.6,"rc":165,"colors":["#FFFFFF","#000080","#B22222","#006400"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":False,"desc":"Traditional piqué polo in classic fit."},
  {"n":"Slim Fit Polo","cat":"Polo","price":165,"orig":190,"disc":13,"img":"polo-tipping","rating":4.4,"rc":102,"colors":["#000000","#FFFFFF","#808080"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":True,"desc":"Tailored slim-fit polo for smarter contemporary silhouette."},
  {"n":"Embroidered Logo Polo","cat":"Polo","price":185,"orig":None,"disc":0,"img":"polo-tipping","rating":4.5,"rc":91,"colors":["#FFFFFF","#000080","#006400"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":True,"sale":False,"desc":"Premium polo with tonal embroidered chest logo."},
  {"n":"Chino Shorts","cat":"Shorts","price":95,"orig":None,"disc":0,"img":"skinny-jeans","rating":4.2,"rc":88,"colors":["#F5DEB3","#808080","#2F4F4F"],"sizes":["28","30","32","34"],"style":"casual","new":False,"sale":False,"desc":"Well-cut 8-inch inseam chino shorts."},
  {"n":"Denim Cut-Off Shorts","cat":"Shorts","price":85,"orig":None,"disc":0,"img":"skinny-jeans","rating":3.9,"rc":42,"colors":["#87CEEB","#1A237E"],"sizes":["28","30","32","34"],"style":"casual","new":False,"sale":False,"desc":"Relaxed denim cut-offs with frayed hem."},
  {"n":"Print Swim Shorts","cat":"Shorts","price":80,"orig":None,"disc":0,"img":"sleeve-striped-tshirt","rating":4.0,"rc":47,"colors":["#FF7F50","#40E0D0","#000080"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":True,"sale":False,"desc":"Fun printed swim shorts with elastic waist."},
  {"n":"Puffer Jacket","cat":"Jackets","price":350,"orig":420,"disc":17,"img":"checkered-shirt","rating":4.8,"rc":205,"colors":["#000000","#000080","#8B0000"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":True,"desc":"Warm recycled-fill quilted puffer jacket."},
  {"n":"Denim Trucker Jacket","cat":"Jackets","price":275,"orig":320,"disc":14,"img":"checkered-shirt","rating":4.5,"rc":130,"colors":["#1A237E","#000000","#87CEEB"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":True,"desc":"Classic 4-pocket denim trucker jacket."},
  {"n":"Bomber Jacket","cat":"Jackets","price":295,"orig":345,"disc":14,"img":"checkered-shirt","rating":4.6,"rc":168,"colors":["#556B2F","#000000","#000080"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":True,"desc":"Classic MA-1 bomber in lightweight water-resistant nylon."},
  {"n":"Oversized Coach Jacket","cat":"Jackets","price":230,"orig":None,"disc":0,"img":"checkered-shirt","rating":4.2,"rc":55,"colors":["#000000","#FFFFFF","#1E90FF"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":True,"sale":False,"desc":"Oversized woven coach jacket with chest patch pocket."},
  {"n":"Relaxed Fit Chinos","cat":"Pants","price":185,"orig":210,"disc":12,"img":"skinny-jeans","rating":4.5,"rc":120,"colors":["#F5DEB3","#808080","#556B2F"],"sizes":["28","30","32","34","36"],"style":"casual","new":False,"sale":True,"desc":"Relaxed chinos with tapered leg and hidden stretch waistband."},
  {"n":"Cable-Knit Sweater","cat":"Sweaters","price":235,"orig":None,"disc":0,"img":"polo-tipping","rating":4.8,"rc":112,"colors":["#F5F5DC","#D2B48C","#808080"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":False,"desc":"Chunky cable-knit sweater in relaxed fit."},
  {"n":"Striped Knit Sweater","cat":"Sweaters","price":190,"orig":225,"disc":16,"img":"sleeve-striped-tshirt","rating":4.3,"rc":70,"colors":["#FFFFFF","#000080","#8B0000"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":True,"desc":"Breton-stripe knit sweater with slightly boxy silhouette."},
  {"n":"Quarter-Zip Sweatshirt","cat":"Sweaters","price":175,"orig":None,"disc":0,"img":"sleeve-striped-tshirt","rating":4.4,"rc":102,"colors":["#000080","#8B0000","#808080"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":False,"desc":"Quarter-zip pullover with soft brushed fleece interior."},
  {"n":"Shawl-Collar Cardigan","cat":"Sweaters","price":225,"orig":None,"disc":0,"img":"polo-tipping","rating":4.6,"rc":58,"colors":["#D2B48C","#808080","#000000"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":False,"desc":"Cosy shawl-collar open cardigan with wooden button closure."},
  {"n":"Classic Wool Scarf","cat":"Accessories","price":65,"orig":None,"disc":0,"img":"checkered-shirt","rating":4.4,"rc":70,"colors":["#8B0000","#000080","#808080"],"sizes":["One Size"],"style":"formal","new":False,"sale":False,"desc":"Premium wool-blend woven scarf in classic block-stripe colours."},
  {"n":"Leather Belt","cat":"Accessories","price":75,"orig":95,"disc":21,"img":"skinny-jeans","rating":4.6,"rc":95,"colors":["#000000","#4A2C2A"],"sizes":["S/M","M/L","L/XL"],"style":"formal","new":False,"sale":True,"desc":"Full-grain leather belt with polished silver-tone edge-stitch."},
  {"n":"Canvas Tote Bag","cat":"Accessories","price":55,"orig":None,"disc":0,"img":"gradient-tshirt","rating":4.1,"rc":48,"colors":["#F5F5DC","#000000","#808080"],"sizes":["One Size"],"style":"casual","new":True,"sale":False,"desc":"Heavy-duty canvas tote with graphic print and inner slip pocket."},
  {"n":"Beanie Hat","cat":"Accessories","price":45,"orig":60,"disc":25,"img":"gradient-tshirt","rating":4.3,"rc":115,"colors":["#808080","#000000","#8B0000","#D2B48C"],"sizes":["One Size"],"style":"casual","new":False,"sale":True,"desc":"Ribbed fine-knit beanie in a slouchy relaxed style."},
  # ── EXTRA 15 TO REACH 100 ──
  {"n":"Oversized Graphic Hoodie","cat":"Hoodies","price":195,"orig":240,"disc":19,"img":"gradient-tshirt","rating":4.6,"rc":188,"colors":["#000000","#FFFFFF","#808080"],"sizes":["Small","Medium","Large","X-Large","XX-Large"],"style":"casual","new":True,"sale":True,"desc":"Heavyweight oversized hoodie with bold chest graphic."},
  {"n":"Slim Fit Chino Shorts","cat":"Shorts","price":90,"orig":None,"disc":0,"img":"skinny-jeans","rating":4.3,"rc":74,"colors":["#F5DEB3","#808080","#2F4F4F","#000000"],"sizes":["28","30","32","34"],"style":"casual","new":False,"sale":False,"desc":"Tailored slim-fit chino shorts in versatile 7-inch inseam."},
  {"n":"Relaxed Linen Shirt","cat":"Shirts","price":165,"orig":None,"disc":0,"img":"vertical-striped-shirt","rating":4.4,"rc":66,"colors":["#FFFFFF","#ADD8E6","#F5DEB3"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":True,"sale":False,"desc":"Breathable relaxed-fit linen shirt with breezy camp collar."},
  {"n":"Slim Taper Joggers","cat":"Pants","price":120,"orig":145,"disc":17,"img":"skinny-jeans","rating":4.5,"rc":210,"colors":["#000000","#808080","#556B2F"],"sizes":["Small","Medium","Large","X-Large"],"style":"gym","new":False,"sale":True,"desc":"Slim-taper jogger with comfortable elastic waistband."},
  {"n":"Stretch Oxford Shirt","cat":"Shirts","price":175,"orig":200,"disc":13,"img":"vertical-striped-shirt","rating":4.5,"rc":92,"colors":["#FFFFFF","#87CEEB","#FFD700"],"sizes":["Small","Medium","Large","X-Large"],"style":"formal","new":False,"sale":True,"desc":"Stretch Oxford shirt with modern slim fit and non-iron finish."},
  {"n":"Pique Knit Polo","cat":"Polo","price":145,"orig":None,"disc":0,"img":"polo-tipping","rating":4.4,"rc":87,"colors":["#000080","#8B0000","#FFFFFF","#006400"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":False,"desc":"Classic pique polo with ribbed collar and two-button placket."},
  {"n":"Nylon Track Shorts","cat":"Shorts","price":70,"orig":85,"disc":18,"img":"sleeve-striped-tshirt","rating":4.1,"rc":95,"colors":["#000000","#1E90FF","#808080"],"sizes":["Small","Medium","Large","X-Large"],"style":"gym","new":False,"sale":True,"desc":"Lightweight nylon shorts with side pockets and contrast taping."},
  {"n":"Double-Breasted Blazer","cat":"Jackets","price":420,"orig":None,"disc":0,"img":"vertical-striped-shirt","rating":4.7,"rc":44,"colors":["#000080","#000000","#808080"],"sizes":["Small","Medium","Large","X-Large"],"style":"formal","new":True,"sale":False,"desc":"Power-dressing double-breasted blazer with peak lapels."},
  {"n":"Distressed Graphic Tee","cat":"T-Shirts","price":105,"orig":130,"disc":19,"img":"gradient-tshirt","rating":4.2,"rc":78,"colors":["#FFFFFF","#000000","#D2B48C"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":True,"desc":"Distressed vintage-look graphic tee with washed-out print."},
  {"n":"Seersucker Shorts","cat":"Shorts","price":88,"orig":None,"disc":0,"img":"skinny-jeans","rating":4.0,"rc":38,"colors":["#87CEEB","#FFFFFF","#FFD700"],"sizes":["28","30","32","34"],"style":"party","new":True,"sale":False,"desc":"Textured seersucker shorts in bright summer colours."},
  {"n":"Half-Zip Fleece","cat":"Sweaters","price":160,"orig":190,"disc":16,"img":"sleeve-striped-tshirt","rating":4.5,"rc":128,"colors":["#808080","#000000","#8B0000"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":True,"desc":"Cosy anti-pill fleece half-zip pullover."},
  {"n":"Washed Denim Jacket","cat":"Jackets","price":255,"orig":None,"disc":0,"img":"checkered-shirt","rating":4.3,"rc":99,"colors":["#87CEEB","#1A237E","#000000"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":True,"sale":False,"desc":"Acid-washed denim jacket with vintage feel."},
  {"n":"Thermal Base Layer Top","cat":"T-Shirts","price":105,"orig":125,"disc":16,"img":"black-striped-tshirt","rating":4.4,"rc":109,"colors":["#000000","#808080","#FFFFFF"],"sizes":["Small","Medium","Large","X-Large"],"style":"gym","new":False,"sale":True,"desc":"Seamless merino-blend base layer top for cold-weather training."},
  {"n":"Relaxed Chore Jacket","cat":"Jackets","price":285,"orig":None,"disc":0,"img":"checkered-shirt","rating":4.5,"rc":64,"colors":["#D2B48C","#808080","#000000"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":True,"sale":False,"desc":"Structured chore coat in heavy cotton canvas."},
  {"n":"French Terry Sweatpants","cat":"Pants","price":135,"orig":160,"disc":16,"img":"skinny-jeans","rating":4.6,"rc":152,"colors":["#808080","#000000","#FFFFFF","#D2B48C"],"sizes":["Small","Medium","Large","X-Large"],"style":"casual","new":False,"sale":True,"desc":"Soft French-terry sweatpants with tapered fit and elasticated cuffs."},
]

# ── 50 seed reviewer personas ──
REVIEWERS = [
    {"first_name": "Liam",    "last_name": "Anderson",  "email": "liam.anderson@example.com"},
    {"first_name": "Olivia",  "last_name": "Martinez",  "email": "olivia.martinez@example.com"},
    {"first_name": "Noah",    "last_name": "Thompson",  "email": "noah.thompson@example.com"},
    {"first_name": "Emma",    "last_name": "Garcia",    "email": "emma.garcia@example.com"},
    {"first_name": "James",   "last_name": "Wilson",    "email": "james.wilson@example.com"},
    {"first_name": "Ava",     "last_name": "Johnson",   "email": "ava.johnson@example.com"},
    {"first_name": "Oliver",  "last_name": "Lee",       "email": "oliver.lee@example.com"},
    {"first_name": "Sophia",  "last_name": "Harris",    "email": "sophia.harris@example.com"},
    {"first_name": "Elijah",  "last_name": "Clark",     "email": "elijah.clark@example.com"},
    {"first_name": "Isabella","last_name": "Lewis",     "email": "isabella.lewis@example.com"},
    {"first_name": "Lucas",   "last_name": "Walker",    "email": "lucas.walker@example.com"},
    {"first_name": "Mia",     "last_name": "Hall",      "email": "mia.hall@example.com"},
    {"first_name": "Mason",   "last_name": "Allen",     "email": "mason.allen@example.com"},
    {"first_name": "Amelia",  "last_name": "Young",     "email": "amelia.young@example.com"},
    {"first_name": "Logan",   "last_name": "King",      "email": "logan.king@example.com"},
    {"first_name": "Harper",  "last_name": "Wright",    "email": "harper.wright@example.com"},
    {"first_name": "Ethan",   "last_name": "Scott",     "email": "ethan.scott@example.com"},
    {"first_name": "Evelyn",  "last_name": "Torres",    "email": "evelyn.torres@example.com"},
    {"first_name": "Aiden",   "last_name": "Nguyen",    "email": "aiden.nguyen@example.com"},
    {"first_name": "Abigail", "last_name": "Hill",      "email": "abigail.hill@example.com"},
    {"first_name": "Jackson", "last_name": "Flores",    "email": "jackson.flores@example.com"},
    {"first_name": "Ella",    "last_name": "Green",     "email": "ella.green@example.com"},
    {"first_name": "Sebastian","last_name":"Adams",     "email": "sebastian.adams@example.com"},
    {"first_name": "Scarlett","last_name": "Nelson",    "email": "scarlett.nelson@example.com"},
    {"first_name": "Carter",  "last_name": "Baker",     "email": "carter.baker@example.com"},
    {"first_name": "Grace",   "last_name": "Carter",    "email": "grace.carter@example.com"},
    {"first_name": "Owen",    "last_name": "Mitchell",  "email": "owen.mitchell@example.com"},
    {"first_name": "Chloe",   "last_name": "Perez",     "email": "chloe.perez@example.com"},
    {"first_name": "Wyatt",   "last_name": "Roberts",   "email": "wyatt.roberts@example.com"},
    {"first_name": "Zoey",    "last_name": "Turner",    "email": "zoey.turner@example.com"},
    {"first_name": "Dylan",   "last_name": "Phillips",  "email": "dylan.phillips@example.com"},
    {"first_name": "Lily",    "last_name": "Campbell",  "email": "lily.campbell@example.com"},
    {"first_name": "Henry",   "last_name": "Parker",    "email": "henry.parker@example.com"},
    {"first_name": "Hannah",  "last_name": "Evans",     "email": "hannah.evans@example.com"},
    {"first_name": "Gabriel", "last_name": "Edwards",   "email": "gabriel.edwards@example.com"},
    {"first_name": "Aria",    "last_name": "Collins",   "email": "aria.collins@example.com"},
    {"first_name": "Julian",  "last_name": "Stewart",   "email": "julian.stewart@example.com"},
    {"first_name": "Penelope","last_name": "Sanchez",   "email": "penelope.sanchez@example.com"},
    {"first_name": "Mateo",   "last_name": "Morris",    "email": "mateo.morris@example.com"},
    {"first_name": "Layla",   "last_name": "Rogers",    "email": "layla.rogers@example.com"},
    {"first_name": "Levi",    "last_name": "Reed",      "email": "levi.reed@example.com"},
    {"first_name": "Riley",   "last_name": "Cook",      "email": "riley.cook@example.com"},
    {"first_name": "Isaac",   "last_name": "Morgan",    "email": "isaac.morgan@example.com"},
    {"first_name": "Nora",    "last_name": "Bell",      "email": "nora.bell@example.com"},
    {"first_name": "Grayson", "last_name": "Murphy",    "email": "grayson.murphy@example.com"},
    {"first_name": "Zoe",     "last_name": "Bailey",    "email": "zoe.bailey@example.com"},
    {"first_name": "Lincoln", "last_name": "Rivera",    "email": "lincoln.rivera@example.com"},
    {"first_name": "Stella",  "last_name": "Cooper",    "email": "stella.cooper@example.com"},
    {"first_name": "Ryan",    "last_name": "Richardson","email": "ryan.richardson@example.com"},
    {"first_name": "Hazel",   "last_name": "Cox",       "email": "hazel.cox@example.com"},
]

# ── Review text pool by rating ──
REVIEW_TEXTS = {
    5: [
        "Absolutely love this! The quality is outstanding and it fits perfectly. Will definitely buy again.",
        "Best purchase I've made this year. The fabric feels premium and the stitching is impeccable.",
        "Exceeded all my expectations. Looks even better in person than in the photos.",
        "Perfect fit, amazing quality. Got so many compliments wearing this out.",
        "Five stars without hesitation. The material is soft, comfortable and holds its shape well.",
        "Fantastic product! Arrived quickly and the packaging was great. Very happy with my purchase.",
        "This is now my favourite piece in my wardrobe. The colour is exactly as shown.",
        "Incredible quality for the price. I've washed it multiple times and it still looks brand new.",
        "Exactly what I was looking for. True to size and the fabric is top notch.",
        "Worth every penny. The craftsmanship is excellent and it's incredibly comfortable.",
    ],
    4: [
        "Really good quality overall. Minor sizing issues but nothing major — I'd still recommend it.",
        "Great product, very happy with it. Delivery was a bit slow but the item itself is excellent.",
        "Good quality fabric and nice fit. The colour is slightly different from the photo but still looks great.",
        "Really pleased with this purchase. Comfortable and well-made. Just wish it came in more colours.",
        "Solid quality and good value. Fits well and looks sharp. Would buy from this brand again.",
        "Nice item, good stitching and comfortable material. One size up from what I usually wear.",
        "Very happy overall. The material feels durable and the style is exactly what I needed.",
        "Good product, looks exactly like the photo. Delivery was on time and packaging was secure.",
        "Pretty good quality. A few loose threads but nothing that detracts from how it looks.",
        "Happy with this purchase. The fit is flattering and the fabric feels premium.",
    ],
    3: [
        "Decent product but nothing special. The quality is average for the price point.",
        "It's okay. Fits as expected but the fabric feels a bit thin compared to what I anticipated.",
        "Average quality. Looks fine but I've seen better at this price range. Not bad though.",
        "Mixed feelings. The style is great but the material isn't as premium as described.",
        "It does the job but I expected better quality given the price. Might look elsewhere next time.",
        "Neither impressed nor disappointed. It's a basic item that fits okay and looks reasonable.",
        "Fairly standard quality. Nothing wrong with it but nothing exceptional either.",
        "Okay for the price. The fit is a bit off and the colour was slightly different from photos.",
        "Mediocre overall. Comfortable enough but I've had better quality from other brands.",
        "It's fine. Serves its purpose but I was hoping for something a bit more premium.",
    ],
    2: [
        "Disappointed with the quality. The fabric feels cheap and the stitching came loose quickly.",
        "Not as described. The sizing is way off and the colour looks completely different in person.",
        "Poor quality for the price. Expected much better. The material is thin and feels fragile.",
        "The stitching is already coming apart after just two washes. Very let down by this.",
        "Would not recommend. The fit is terrible and the fabric is uncomfortable to wear.",
        "Sadly not what I expected. The photos look great but the actual product is disappointing.",
        "Quality is well below average. Feels like it won't last more than a few months.",
        "Sizing runs very small. I ordered my usual size and it was far too tight.",
    ],
    1: [
        "Terrible quality. Fell apart after the first wash. Complete waste of money.",
        "Awful experience. The item looks nothing like the photos and the material is very poor.",
        "Do not buy this. The quality is shocking and the sizing is completely inaccurate.",
        "Worst purchase ever. Returned it immediately. The fabric is paper-thin and poorly made.",
    ],
}


def get_review_text(rating: int) -> str:
    return random.choice(REVIEW_TEXTS.get(rating, REVIEW_TEXTS[3]))


class Command(BaseCommand):
    help = 'Seed 100 products with real images and 50 reviews each'

    def handle(self, *args, **kwargs):
        self.stdout.write('🌱 Seeding database...')

        # ── Copy images ──
        server_dir  = settings.BASE_DIR
        project_dir = server_dir.parent
        assets_dir  = project_dir / 'client' / 'src' / 'assets' / 'products'
        media_dir   = settings.MEDIA_ROOT / 'products'
        media_dir.mkdir(parents=True, exist_ok=True)

        for key, filename in IMG_MAP.items():
            src = assets_dir / filename
            dst = media_dir / filename
            if src.exists() and not dst.exists():
                shutil.copy2(src, dst)
                self.stdout.write(f'  📸 Copied {filename}')
            elif not src.exists():
                self.stdout.write(self.style.WARNING(f'  ⚠ Source not found: {src}'))

        # ── Categories ──
        cat_map = {}
        for p in PRODUCTS:
            name = p['cat']
            if name not in cat_map:
                cat, _ = Category.objects.get_or_create(
                    slug=slugify(name), defaults={'name': name}
                )
                cat_map[name] = cat

        # ── Products ──
        Product.objects.all().delete()
        created = 0
        product_objs = []
        for i, d in enumerate(PRODUCTS):
            slug     = f"{slugify(d['n'])}-{i}"
            fname    = IMG_MAP.get(d['img'], '')
            img_path = f"products/{fname}" if fname else ''
            prod = Product.objects.create(
                name=d['n'], slug=slug,
                category=cat_map[d['cat']],
                description=d['desc'],
                price=d['price'],
                original_price=d.get('orig'),
                discount=d.get('disc', 0),
                image=img_path,
                rating=d['rating'],
                review_count=d['rc'],
                colors=d['colors'],
                sizes=d['sizes'],
                style=d['style'],
                is_new=d['new'],
                is_sale=d['sale'],
                stock=100,
            )
            product_objs.append(prod)
            created += 1
        self.stdout.write(f'  ✅ {created} products across {len(cat_map)} categories')

        # ── Demo users ──
        if not User.objects.filter(email='admin@shopco.com').exists():
            User.objects.create_superuser(
                username='admin', email='admin@shopco.com',
                password='admin123', first_name='Admin', last_name='User'
            )
        if not User.objects.filter(email='demo@shopco.com').exists():
            User.objects.create_user(
                username='demo', email='demo@shopco.com',
                password='demo1234', first_name='Demo', last_name='User'
            )
        self.stdout.write('  ✅ Demo users ready')

        # ── Seed reviewer accounts ──
        self.stdout.write('  👥 Creating reviewer accounts...')
        reviewer_objs = []
        for r in REVIEWERS:
            username = r['email'].split('@')[0]
            user, _ = User.objects.get_or_create(
                email=r['email'],
                defaults={
                    'username':   username,
                    'first_name': r['first_name'],
                    'last_name':  r['last_name'],
                }
            )
            if _:
                user.set_password('reviewer123')
                user.save()
            reviewer_objs.append(user)
        self.stdout.write(f'  ✅ {len(reviewer_objs)} reviewer accounts ready')

        # ── Seed reviews (50 per product) ──
        self.stdout.write('  ✍️  Seeding reviews...')
        Review.objects.all().delete()

        # Rating → weighted star distribution so avg matches product rating
        def pick_rating(target_rating: float) -> int:
            """Pick a star rating biased toward the product's target average."""
            r = round(target_rating)
            weights = {
                1: [60, 20, 10, 5,  5],
                2: [20, 40, 20, 10, 10],
                3: [5,  15, 40, 25, 15],
                4: [2,  5,  15, 40, 38],
                5: [1,  2,  5,  12, 80],
            }
            w = weights.get(r, weights[4])
            return random.choices([1, 2, 3, 4, 5], weights=w, k=1)[0]

        total_reviews = 0
        for prod in product_objs:
            # Shuffle reviewers so each product gets a fresh random order
            shuffled = reviewer_objs[:]
            random.shuffle(shuffled)
            reviewers_for_product = shuffled[:50]   # exactly 50 per product

            bulk = []
            ratings_used = []
            for user in reviewers_for_product:
                star = pick_rating(float(prod.rating))
                ratings_used.append(star)
                bulk.append(Review(
                    product=prod,
                    user=user,
                    rating=star,
                    text=get_review_text(star),
                ))
            Review.objects.bulk_create(bulk)

            # Recalculate product rating & count from seeded reviews
            avg = round(sum(ratings_used) / len(ratings_used), 1)
            prod.review_count = len(ratings_used)
            prod.rating       = avg
            prod.save(update_fields=['review_count', 'rating'])

            total_reviews += len(bulk)

        self.stdout.write(f'  ✅ {total_reviews} reviews seeded ({total_reviews // len(product_objs)} per product)')
        self.stdout.write(self.style.SUCCESS(
            '🎉 Done!  admin@shopco.com / admin123  |  demo@shopco.com / demo1234'
        ))