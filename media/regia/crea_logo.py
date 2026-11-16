# Logo profilo Instagram di Regia, 1080x1080 (Instagram lo ritaglia a cerchio)
from PIL import Image, ImageDraw, ImageFont
W=1080
img=Image.new("RGB",(W,W))
d=ImageDraw.Draw(img)
a,b=(124,58,237),(236,72,153)  # viola -> rosa
for y in range(W):
    t=y/W; d.line([(0,y),(W,y)],fill=tuple(int(a[i]+(b[i]-a[i])*t) for i in range(3)))
B="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
# fumetto bianco (commento -> messaggio)
d.rounded_rectangle((270,230,810,640),90,fill="white")
d.polygon([(380,630),(380,760),(520,630)],fill="white")
F=ImageFont.truetype(B,330); w=d.textlength("R",font=F)
d.text(((W-w)/2,255),"R",font=F,fill=(124,58,237))
F2=ImageFont.truetype(B,120); w=d.textlength("REGIA",font=F2)
d.text(((W-w)/2,770),"REGIA",font=F2,fill="white")
img.save("/home/user/davide-ai-os/media/regia/logo_regia.png")
