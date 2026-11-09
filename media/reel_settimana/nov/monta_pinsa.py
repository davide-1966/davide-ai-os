import subprocess
src=open("monta.py").read().split("def build")[0]; exec(src)
V=R+"/media/video_davide/9nov/pinsa_alveoli_controluce.mp4"; TOT=14
T={"it":[("ERRORE N. 7\nLa tua pinsa viene compatta, senza bolle?",58,RED,0,3.5,260),("Guarda come faccio io",50,DARK,0,3.5,580),
         ("La mia pinsa, fatta a casa, forno di casa",52,DARK,3.5,7.5,260),("Impasto al 70% d'acqua, con la biga",52,DARK,7.5,11,260),
         ("Seguimi per l'errore n. 8",56,RED,11,99,260),("Commenta BIGA: tabella della biga + 1 mese gratis dell'app",46,RED,7.5,99,1560)],
   "de":[("FEHLER NR. 7\nDeine Pinsa wird kompakt, ohne Blasen?",58,RED,0,3.5,260),("Schau, wie ich es mache",50,DARK,0,3.5,580),
         ("Meine Pinsa, zu Hause gemacht, normaler Backofen",50,DARK,3.5,7.5,260),("Teig mit 70 % Wasser, mit Biga",52,DARK,7.5,11,260),
         ("Folge mir für Fehler Nr. 8",56,RED,11,99,260),("Kommentiere BIGA: Biga-Tabelle + 1 Monat App gratis",46,RED,7.5,99,1560)]}
for L,cards in T.items():
    inp=["-t",str(TOT),"-i",V]; fc=[f"[0:v]scale=1176:1920:flags=lanczos,crop=1080:1920,setsar=1,fps=30,{WARM},format=yuv420p[v0]"]; last="v0"
    for c,(t,fs,bg,a,b,y) in enumerate(cards):
        p=f"{S}/pin_{L}_{c}.png"; box(t,fs,p,bg); inp+=["-i",p]
        fc.append(f"[{last}][{c+1}:v]overlay=(W-w)/2:{y}:enable='between(t,{a},{b})'[o{c}]"); last=f"o{c}"
    inp+=["-ss","4","-t",str(TOT),"-i",R+"/media/video_davide/25ott/pallina.mp4"]
    fc.append(f"[{len(cards)+1}:a]volume=0.5,afade=t=out:st={TOT-1}:d=1[au]")
    subprocess.run(["ffmpeg","-v","error","-y"]+inp+["-filter_complex",";".join(fc),"-map",f"[{last}]","-map","[au]","-t",str(TOT),"-c:v","libx264","-crf","20","-preset","medium","-c:a","aac","-b:a","128k","-movflags","+faststart",f"{OUT}/pinsa_{L}.mp4"],check=True)
    print(L)
