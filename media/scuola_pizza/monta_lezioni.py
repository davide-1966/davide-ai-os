import subprocess,sys
src=open("monta.py").read().split("def build")[0]; exec(src)
from PIL import Image, ImageDraw
U="/root/.claude/uploads/ffa84b72-a43e-573d-9fcb-b51ae859d026"
VD=R+"/media/video_davide/"; I=VD+"impasto_16ott/"; N=VD+"3nov/"; FB=R+"/media/caroselli/foto_biga/"
D=420
m=Image.new("L",(D,D),0); ImageDraw.Draw(m).ellipse([0,0,D-1,D-1],fill=255); m.save(S+"/mask.png")
ring=Image.new("RGBA",(D+16,D+16),(0,0,0,0)); ImageDraw.Draw(ring).ellipse([0,0,D+15,D+15],fill=(255,244,225,255)); ring.save(S+"/ring.png")
P="scale=1080:1920:flags=lanczos,setsar=1,fps=30"
LAND="crop=405:720:437:0,"+P
BIL="crop=608:1080:470:0,"+P
def foto(dur): return f"scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.0007,1.12)':d=1:s=1080x1920:fps=30,setsar=1"
L={
"lezione3_it":dict(av=U+"/aab04edc-Impasto_diretto_o_biga_50_max30MB.mp4", cut=(22.0,25.03), total=66.73,
 segs=[(I+"biga_blocco_1.mp4",0,8.2,P),(FB+"biga_3.jpg",None,7.5,"foto"),(FB+"biga_1.jpg",None,6.3,"foto"),
       (I+"biga_blocco_2.mp4",0,6.57,LAND),(I+"biga_blocco_1.mp4",6.6,8.43,P),(I+"impastatrice_3.mp4",5,9.4,P),
       (I+"impastatrice_4.mp4",0,7.1,P),(FB+"biga_2.jpg",None,5.6,"foto"),(I+"impastatrice_2.mp4",8,7.63,P)],
 cards=[("SCUOLA DI PIZZA · LEZIONE 3\nImpasto diretto o biga?",62,RED,0,4.3,260),
        ("Impasto diretto: tutto insieme, un solo impasto",52,DARK,4.3,8.2,260),
        ("Biga: due tempi\n1. preimpasto  2. secondo impasto",52,DARK,8.2,15.7,260),
        ("Biga al 50% su 1 kg di farina",54,DARK,15.7,19.3,260),
        ("GIORNO 1 – la biga\n500 g farina forte W 350–380\n225–250 g acqua\n4–5 g lievito di birra fresco",50,DARK,19.3,25.9,260),
        ("Impasta pochissimo: deve restare grezza",52,DARK,25.9,28.9,260),
        ("Contenitore grande\n18 ore a 18 °C",58,RED,28.9,36.8,260),
        ("GIORNO 2 – nella macchina\n+ 500 g farina\nacqua fino al 70%\n20 g sale\n(se vuoi: 5 g malto, 20 g olio EVO)",48,DARK,36.8,53.2,260),
        ("Biga al 70% o 100%: più profumo, crosta più croccante, ma più attenzione",48,DARK,53.2,59.0,260),
        ("Prossima settimana: lezione 4",52,DARK,64.2,99,260),
        ("Commenta IMPASTO: tabella gratis + 1 mese dell'app",48,RED,59.0,99,1560)]),
"lezione4_it":dict(av=U+"/a49e126f-Cosa_fare_dopo_la_biga_max30MB.mp4", cut=None, total=37.35,
 segs=[(I+"impastatrice_2.mp4",10,6.0,P),(I+"impastatrice_termometro.mp4",20,8.4,P),(N+"chiusura_pallina_alto.mp4",0,3.8,P),
       (N+"pallina_bilancia_240g.mp4",3,3.8,BIL),(N+"chiusura_pallina_alto.mp4",10,4.66,P),(N+"cassette_da_12.mp4",0,5.02,P),
       (N+"panetti_cassetta.jpg",None,5.67,"foto")],
 cards=[("SCUOLA DI PIZZA · LEZIONE 4\nCosa fai dopo la biga?",62,RED,0,4.1,260),
        ("Riposo in massa: sul banco o in un contenitore coperto\n30 minuti – qualche ora",50,DARK,4.1,14.4,260),
        ("Staglio: dividi l'impasto e formi i panetti",52,DARK,14.4,18.2,260),
        ("Io li peso tutti: 240 g",58,RED,18.2,22.0,260),
        ("Chiudi bene ogni pallina",56,DARK,22.0,26.66,260),
        ("Lievitano fino al raddoppio, poi stendi e inforni",52,DARK,26.66,31.68,260),
        ("Prossima settimana: lezione 5",52,DARK,35.0,99,260),
        ("Commenta IMPASTO: tabella gratis + 1 mese dell'app",48,RED,31.68,99,1560)])}
for name in sys.argv[1:]:
    c=L[name]; T=c["total"]; inp=[]; fc=[]
    for i,(f,ss,du,flt) in enumerate(c["segs"]):
        if flt=="foto": inp+=["-loop","1","-t",str(du),"-i",f]; flt=foto(du)
        else: inp+=["-ss",str(ss),"-t",str(du),"-i",f]
        fc.append(f"[{i}:v]{flt},{WARM},format=yuv420p,setsar=1,trim=duration={du},setpts=PTS-STARTPTS[s{i}]")
    n=len(c["segs"]); fc.append("".join(f"[s{i}]" for i in range(n))+f"concat=n={n}:v=1:a=0[bg]")
    k=n; inp+=["-i",c["av"],"-i",S+"/mask.png","-i",S+"/ring.png"]
    if c["cut"]:
        a,b=c["cut"]
        fc.append(f"[{k}:v]trim=0:{a},setpts=PTS-STARTPTS[va];[{k}:v]trim=start={b},setpts=PTS-STARTPTS[vb];[va][vb]concat=n=2:v=1:a=0[avv]")
        fc.append(f"[{k}:a]atrim=0:{a},asetpts=PTS-STARTPTS[aa];[{k}:a]atrim=start={b},asetpts=PTS-STARTPTS[ab];[aa][ab]concat=n=2:v=0:a=1[voice]")
    else:
        fc.append(f"[{k}:v]null[avv]"); fc.append(f"[{k}:a]anull[voice]")
    fc.append(f"[avv]crop=900:900:90:20,scale={D}:{D},fps=30,format=rgba[av];[{k+1}:v]format=gray[mk];[av][mk]alphamerge[avc]")
    fc.append(f"[bg][{k+2}:v]overlay=W-w-40:1100[b1];[b1][avc]overlay=W-{D}-48:1108[v0]")
    last="v0"; j=k+3
    for q,(t,fs,bg,a,b,y) in enumerate(c["cards"]):
        p=f"{S}/{name}_c{q}.png"; box(t,fs,p,bg); inp+=["-i",p]
        fc.append(f"[{last}][{j}:v]overlay=(W-w)/2:{y}:enable='between(t,{a},{b})'[o{q}]"); last=f"o{q}"; j+=1
    inp+=["-ss","4","-t",str(T),"-i",VD+"25ott/pallina.mp4"]
    fc.append(f"[voice]volume=1.0[vo];[{j}:a]volume=0.12[amb];[vo][amb]amix=inputs=2:duration=first:normalize=0,afade=t=out:st={T-0.8}:d=0.8[au]")
    subprocess.run(["ffmpeg","-v","error","-y"]+inp+["-filter_complex",";".join(fc),"-map",f"[{last}]","-map","[au]","-t",str(T),"-c:v","libx264","-crf","21","-preset","medium","-c:a","aac","-b:a","128k","-movflags","+faststart",f"{R}/media/scuola_pizza/{name}.mp4"],check=True)
    print(name)
