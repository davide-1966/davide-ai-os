from PIL import Image, ImageDraw, ImageFont
W,H=1080,1920; B="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"; G=(255,214,102)
def box(nome, righe, y, size=64, colori=None):
    im=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(im); f=ImageFont.truetype(B,size)
    lh=size+16; tw=max(d.textlength(r,font=f) for r in righe); pad=34
    bw=tw+pad*2; bh=lh*len(righe)-16+pad*2; x0=(W-bw)/2
    d.rounded_rectangle([x0,y,x0+bw,y+bh],radius=26,fill=(20,16,14,215))
    for i,r in enumerate(righe):
        c=(colori or ["white"]*len(righe))[i]
        d.text(((W-d.textlength(r,font=f))/2,y+pad+i*lh),r,font=f,fill=c)
    im.save(f"cella/{nome}.png")
box("t1",["Mi sono costruito","una cella di lievitazione"],260,66)
box("t2",["Termostato, 3 ventole,","luce interna"],1450)
box("t3",["Costo totale:","350 €"],1450,72,["white",G])
box("t4",["Biga a 18 °C"],1450,80,[G])
box("t5",["Panetti a 4-5 °C"],1450,80,[G])
box("t6",["Il risultato?"],1500,80)
