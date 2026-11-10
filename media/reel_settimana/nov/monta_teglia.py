import subprocess
src=open("monta.py").read().split("def build")[0]; exec(src)
V=R+"/media/video_davide/9nov/teglia_casa_30x40.mp4"; TOT=16
T={"it":[("ERRORE N. 6\nPensi che a casa non venga così?",60,RED,0,3.5,260),("Guarda come faccio io",50,DARK,0,3.5,560),
         ("Teglia di casa 30×40, forno di casa",52,DARK,3.5,8,260),("Impasto al 70% d'acqua, stesso metodo della biga",50,DARK,8,12.5,260),
         ("Seguimi: ogni giorno un segreto della mia pizzeria",48,RED,12.5,99,260),("Commenta BIGA: tabella della biga + 1 mese gratis dell'app",46,RED,8,99,1560)],
   "de":[("FEHLER NR. 6\nDu glaubst, zu Hause klappt das nicht?",58,RED,0,3.5,260),("Schau, wie ich es mache",50,DARK,0,3.5,560),
         ("Blech von zu Hause 30×40, normaler Backofen",50,DARK,3.5,8,260),("Teig mit 70 % Wasser, gleiche Methode wie bei der Biga",48,DARK,8,12.5,260),
         ("Folge mir: jeden Tag ein Geheimnis aus meiner Pizzeria",46,RED,12.5,99,260),("Kommentiere BIGA: Biga-Tabelle + 1 Monat App gratis",46,RED,8,99,1560)]}
for L,cards in T.items():
    inp=["-t",str(TOT),"-i",V]; fc=[f"[0:v]scale=1115:1920:flags=lanczos,crop=1080:1920,setsar=1,fps=30,{WARM},format=yuv420p[v0]"]; last="v0"
    for c,(t,fs,bg,a,b,y) in enumerate(cards):
        p=f"{S}/teg_{L}_{c}.png"; box(t,fs,p,bg); inp+=["-i",p]
        fc.append(f"[{last}][{c+1}:v]overlay=(W-w)/2:{y}:enable='between(t,{a},{b})'[o{c}]"); last=f"o{c}"
    inp+=["-ss","4","-t",str(TOT),"-i",R+"/media/video_davide/25ott/pallina.mp4"]
    fc.append(f"[{len(cards)+1}:a]volume=0.5,afade=t=out:st={TOT-1}:d=1[au]")
    subprocess.run(["ffmpeg","-v","error","-y"]+inp+["-filter_complex",";".join(fc),"-map",f"[{last}]","-map","[au]","-t",str(TOT),"-c:v","libx264","-crf","20","-preset","medium","-c:a","aac","-b:a","128k","-movflags","+faststart",f"{OUT}/teglia_{L}.mp4"],check=True)
    print(L)
