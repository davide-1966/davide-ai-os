import subprocess
src=open("monta.py").read().split("def build")[0]; exec(src)
V=R+"/media/video_davide/9nov/pinsa_stesura_forno.mp4"
F="scale=1176:1920:flags=lanczos,crop=1080:1920,setsar=1,fps=30"
REEL=[(21,9),(39,3),(45.5,2),(16,1.5)]
YT=[(21,17),(39,10),(49.5,8),(15,5)]
C={"pinsa_stesura_it":(REEL,[("ERRORE N. 8\nStendi la pinsa col mattarello?",60,RED,0,3.5,260),("Guarda come faccio io",50,DARK,0,3.5,560),
      ("Con le dita, sulla semola",54,DARK,3.5,9,260),("Poi sulla pala",54,DARK,9,12,260),("Un filo d'olio prima di infornare",52,DARK,12,14,260),
      ("Seguimi per l'errore n. 9",56,RED,14,99,260),("Commenta BIGA: tabella della biga + 1 mese gratis dell'app",46,RED,9,99,1560)]),
   "pinsa_stesura_de":(REEL,[("FEHLER NR. 8\nPinsa mit dem Nudelholz ausrollen?",58,RED,0,3.5,260),("Schau, wie ich es mache",50,DARK,0,3.5,560),
      ("Mit den Fingern, auf Hartweizengrieß",52,DARK,3.5,9,260),("Dann auf den Schieber",54,DARK,9,12,260),("Etwas Olivenöl vor dem Backen",52,DARK,12,14,260),
      ("Folge mir für Fehler Nr. 9",56,RED,14,99,260),("Kommentiere BIGA: Biga-Tabelle + 1 Monat App gratis",46,RED,9,99,1560)]),
   "pinsa_yt_it":(YT,[("Come stendo la pinsa a casa",62,RED,0,3.5,260),("Sulla semola, con le dita: niente mattarello",52,DARK,3.5,17,260),
      ("Poi sulla pala",54,DARK,17,22,260),("Un filo d'olio prima di infornare",52,DARK,22,27,260),("Forno di casa",56,DARK,27,35,260),
      ("Impasto al 70% d'acqua, con la biga",52,DARK,35,99,260),("Vai su Instagram @pizza_perfetta_a_casa e commenta BIGA",46,RED,27,99,1560)])}
for name,(segs,cards) in C.items():
    TOT=sum(d for _,d in segs); inp=[]; fc=[]
    for i,(ss,du) in enumerate(segs):
        inp+=["-ss",str(ss),"-t",str(du),"-i",V]; fc.append(f"[{i}:v]{F},{WARM},format=yuv420p,setpts=PTS-STARTPTS[s{i}]")
    n=len(segs); fc.append("".join(f"[s{i}]" for i in range(n))+f"concat=n={n}:v=1:a=0[v0]"); last="v0"
    for c,(t,fs,bg,a,b,y) in enumerate(cards):
        p=f"{S}/{name}_{c}.png"; box(t,fs,p,bg); inp+=["-i",p]
        fc.append(f"[{last}][{n+c}:v]overlay=(W-w)/2:{y}:enable='between(t,{a},{b})'[o{c}]"); last=f"o{c}"
    inp+=["-ss","4","-t",str(TOT),"-i",R+"/media/video_davide/25ott/pallina.mp4"]
    fc.append(f"[{n+len(cards)}:a]volume=0.5,afade=t=out:st={TOT-1}:d=1[au]")
    subprocess.run(["ffmpeg","-v","error","-y"]+inp+["-filter_complex",";".join(fc),"-map",f"[{last}]","-map","[au]","-t",str(TOT),"-c:v","libx264","-crf","21","-preset","medium","-c:a","aac","-b:a","128k","-movflags","+faststart",f"{OUT}/{name}.mp4"],check=True)
    print(name,TOT)
