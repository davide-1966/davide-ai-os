# Banner YouTube DE 2560x1440 (zona sicura centrale 1546x423), foto vera di Davide
import sys
from PIL import Image, ImageFilter, ImageDraw, ImageFont, ImageOps
R="/home/user/davide-ai-os/media/"
foto=sys.argv[1]
W,H=2560,1440
img=ImageOps.fit(Image.open(foto).convert("RGB"),(W,H),centering=(0.5,0.5))
img=img.filter(ImageFilter.GaussianBlur(6))
d=ImageDraw.Draw(img,"RGBA")
x0,y0,x1,y1=(W-1546)//2,(H-423)//2,(W+1546)//2,(H+423)//2
d.rounded_rectangle((x0,y0,x1,y1),24,fill=(20,16,14,205))
B="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"; N="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
def c(t,f,s,col,y):
    F=ImageFont.truetype(f,s); w=d.textlength(t,font=F); d.text(((W-w)/2,y),t,font=F,fill=col)
c("PIZZA PERFETTA A CASA",B,104,(255,255,255),y0+45)
c("Pizzaiolo seit über 20 Jahren · Pizzeria-Geheimnisse für zu Hause",N,44,(242,196,92),y0+205)
c("Jede Woche neue Shorts: Fehler, Tricks, Pizza-Schule",B,46,(232,72,52),y0+300)
img.save(R+"youtube_de/banner_de.jpg",quality=90)
