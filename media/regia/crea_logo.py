# Logo profilo Instagram di Regia, 1080x1080 (ritagliato a cerchio). Disegnato a 4x e ridotto (bordi lisci).
from PIL import Image, ImageDraw, ImageFilter, ImageFont
S=4; W=1080*S
OUT="/home/user/davide-ai-os/media/regia/"
def grad(cols):
    # sfumatura diagonale su più colori
    g=Image.new("RGB",(256,1)); p=g.load(); n=len(cols)-1
    for x in range(256):
        t=x/255*n; i=min(int(t),n-1); f=t-i
        p[x,0]=tuple(int(cols[i][k]+(cols[i+1][k]-cols[i][k])*f) for k in range(3))
    return g.resize((W*2,W*2)).rotate(45,resample=Image.BICUBIC).crop((W//2,W//2,W//2+W,W//2+W))
def bubble_mask():
    m=Image.new("L",(W,W),0); d=ImageDraw.Draw(m)
    d.rounded_rectangle((250*S,260*S,830*S,700*S),130*S,fill=255)
    d.polygon([(360*S,680*S),(330*S,850*S),(520*S,690*S)],fill=255)
    return m
def play_mask():
    m=Image.new("L",(W,W),0); d=ImageDraw.Draw(m)
    cx,cy,r=548*S,480*S,105*S
    d.polygon([(cx-r*0.75,cy-r),(cx-r*0.75,cy+r),(cx+r,cy)],fill=255)
    return m.filter(ImageFilter.GaussianBlur(10*S)).point(lambda v:255 if v>110 else 0)  # punte arrotondate
IG=[(88,81,219),(131,58,180),(225,48,108),(253,89,73),(252,176,69)]
def shadow(mask,off=18,blur=30,alpha=110):
    s=Image.new("L",(W,W),0); s.paste(mask,(0,off*S)); return s.filter(ImageFilter.GaussianBlur(blur*S)).point(lambda v:v*alpha//255)
# A: sfondo sfumato, fumetto bianco, play sfumato
a=grad(IG); bm=bubble_mask(); pm=play_mask()
a.paste((40,10,60),mask=shadow(bm)); a.paste((255,255,255),mask=bm); a.paste(grad(IG),mask=pm)
a.resize((1080,1080),Image.LANCZOS).save(OUT+"logo_regia_A.png")
# B: sfondo scuro, fumetto sfumato, play bianco
b=Image.new("RGB",(W,W),(18,16,32)); glow=bm.filter(ImageFilter.GaussianBlur(70*S)).point(lambda v:v*90//255)
b.paste(grad(IG),mask=glow); b.paste(grad(IG),mask=bm); b.paste((255,255,255),mask=pm)
b.resize((1080,1080),Image.LANCZOS).save(OUT+"logo_regia_B.png")
