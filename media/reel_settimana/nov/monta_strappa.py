import subprocess
src=open("monta.py").read().split("def build")[0]; exec(src)
from PIL import Image, ImageDraw
D=420
m=Image.new("L",(D,D),0); ImageDraw.Draw(m).ellipse([0,0,D-1,D-1],fill=255); m.save(S+"/mask.png")
ring=Image.new("RGBA",(D+16,D+16),(0,0,0,0)); ImageDraw.Draw(ring).ellipse([0,0,D+15,D+15],fill=(255,244,225,255)); ring.save(S+"/ring.png")
AV=R+"/media/shorts/impasto_freddo.mp4"; VD=R+"/media/video_davide/"
P="scale=1080:1920:flags=lanczos,setsar=1,fps=30"; PIN="scale=1176:1920:flags=lanczos,crop=1080:1920,setsar=1,fps=30"
segs=[(VD+"3nov/cassette_da_12.mp4",0,4.6,P),(VD+"9nov/pinsa_stesura_forno.mp4",21,4.0,PIN),(VD+"9nov/pinsa_stesura_forno.mp4",30,3.65,PIN),(R+"/media/archivio/margherita_alto.mp4",0,1.5,"crop=1080:1920:0:240,setsar=1,fps=30")]
keep=[(0,8.6),(13.35,17.0)]; HOLD=1.5; TOT=sum(s[2] for s in segs)
cards=[("ERRORE N. 9\nLa pizza si strappa quando la stendi?",58,RED,0,4.6,260),("Guarda come faccio io",50,DARK,0,4.6,580),
       ("È fredda: il glutine è rigido e si rompe",52,DARK,4.6,8.6,260),
       ("Io la tolgo dal frigo 2 ore prima: a 21 °C, liscia e gonfia, è pronta",48,DARK,8.6,99,260),
       ("Commenta IMPASTO: tabella gratis + 1 mese dell'app",48,RED,8.6,99,1560)]
inp=[];fc=[]
for i,(f,ss,du,flt) in enumerate(segs):
    inp+=["-ss",str(ss),"-t",str(du),"-i",f]; fc.append(f"[{i}:v]{flt},{WARM},format=yuv420p,setpts=PTS-STARTPTS[s{i}]")
n=len(segs); fc.append("".join(f"[s{i}]" for i in range(n))+f"concat=n={n}:v=1:a=0[bg]")
k=n; inp+=["-i",AV,"-i",S+"/mask.png","-i",S+"/ring.png"]; vs=as_=""
for q,(a,b) in enumerate(keep):
    fc.append(f"[{k}:v]trim=start={a}:end={b},setpts=PTS-STARTPTS[vk{q}]"); fc.append(f"[{k}:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS[ak{q}]"); vs+=f"[vk{q}]"; as_+=f"[ak{q}]"
fc.append(f"{vs}concat=n={len(keep)}:v=1:a=0,tpad=stop_mode=clone:stop_duration={HOLD}[avv]")
fc.append(f"{as_}concat=n={len(keep)}:v=0:a=1,apad=pad_dur={HOLD}[voice]")
fc.append(f"[avv]crop=900:900:90:20,scale={D}:{D},fps=30,format=rgba[av];[{k+1}:v]format=gray[mk];[av][mk]alphamerge[avc]")
fc.append(f"[bg][{k+2}:v]overlay=W-w-40:1100[b1];[b1][avc]overlay=W-{D}-48:1108[v0]")
last="v0"; j=k+3
for q,(t,fs,bg,a,b,y) in enumerate(cards):
    p=f"{S}/str_{q}.png"; box(t,fs,p,bg); inp+=["-i",p]
    fc.append(f"[{last}][{j}:v]overlay=(W-w)/2:{y}:enable='between(t,{a},{b})'[o{q}]"); last=f"o{q}"; j+=1
inp+=["-ss","4","-t",str(TOT),"-i",VD+"25ott/pallina.mp4"]
fc.append(f"[voice]volume=1.0[vo];[{j}:a]volume=0.12[amb];[vo][amb]amix=inputs=2:duration=longest:normalize=0,afade=t=out:st={TOT-0.8}:d=0.8[au]")
subprocess.run(["ffmpeg","-v","error","-y"]+inp+["-filter_complex",";".join(fc),"-map",f"[{last}]","-map","[au]","-t",str(TOT),"-c:v","libx264","-crf","21","-preset","medium","-c:a","aac","-b:a","128k","-movflags","+faststart",f"{OUT}/strappa_it.mp4"],check=True)
print(TOT)
