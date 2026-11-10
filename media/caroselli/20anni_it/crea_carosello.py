from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter
R="/home/user/davide-ai-os/media/foto_davide/archivio_10nov/"; OUT="/home/user/davide-ai-os/media/caroselli/20anni_it/"
B="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"; N="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
RED=(200,40,30); CREAM=(255,244,225)
S=[("02.jpg","20 anni in pizzeria,\nin tanti locali diversi.","5 cose che non cambio mai 👉",True),
   ("12.jpg","1. Peso tutto.","Ogni panetto 240 g: così le pizze escono tutte uguali.",False),
   ("19.jpg","2. Pomodoro a spirale.","Dal centro verso il bordo: il cornicione resta pulito.",False),
   ("01.jpg","3. Il sapore lo dà il tempo,\nnon il lievito.","La mia biga matura 18 ore a 18 °C.",False),
   ("04.jpg","4. Mai stendere l'impasto freddo.","2 ore fuori dal frigo: a 21 °C, liscio e gonfio, è pronto.",False),
   ("09.jpg","5. Verdure? Le cuocio prima.","Zucchine grigliate: la pizza resta asciutta, non molle.",False),
   ("06.jpg","Vuoi le mie dosi?","Commenta IMPASTO o BIGA:\nti mando la mia tabella\n+ 1 mese gratis della mia app 🍕",False)]
def wrap(d,t,f,w):
    out=[]
    for para in t.split("\n"):
        cur=""
        for wd in para.split():
            x=(cur+" "+wd).strip()
            if d.textlength(x,font=f)>w and cur: out.append(cur); cur=wd
            else: cur=x
        out.append(cur)
    return out
for i,(f,title,sub,cover) in enumerate(S,1):
    im=ImageOps.exif_transpose(Image.open(R+f)).convert("RGB"); im=ImageOps.fit(im,(1080,1350),Image.LANCZOS)
    g=Image.new("L",(1080,1350),0); gd=ImageDraw.Draw(g)
    for y in range(1350):
        a=0 if y<700 else int(225*min(1,(y-700)/450)); gd.line([(0,y),(1080,y)],fill=a)
    im=Image.composite(Image.new("RGB",im.size,(15,10,8)),im,g); d=ImageDraw.Draw(im)
    ft=ImageFont.truetype(B,76 if cover else 64); fs=ImageFont.truetype(N,46 if not cover else 50)
    tl=wrap(d,title,ft,960); sl=wrap(d,sub.replace(" 👉"," →").replace(" 🍕",""),fs,960)
    h=len(tl)*int(ft.size*1.2)+30+len(sl)*int(fs.size*1.3); y=1350-90-h
    for l in tl: d.text((60,y),l,font=ft,fill=CREAM); y+=int(ft.size*1.2)
    y+=30
    for l in sl: d.text((60,y),l,font=fs,fill=(255,215,190) if i==7 else CREAM); y+=int(fs.size*1.3)
    d.rounded_rectangle([60,60,60+330,60+70],18,fill=RED); d.text((82,72),"@pizza_perfetta_a_casa"[:22],font=ImageFont.truetype(B,30),fill=CREAM) if False else d.text((82,74),f"{i}/7  · Davide",font=ImageFont.truetype(B,34),fill=CREAM)
    im.save(OUT+f"slide_{i}.jpg",quality=90)
print("ok")
