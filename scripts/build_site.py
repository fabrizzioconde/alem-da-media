#!/usr/bin/env python3
"""Gera o site dos alunos (pasta dist/) para publicar no GitHub Pages.

Para cada módulo de config/modulos.json, copia o HTML para dist/<pasta>/index.html,
colocando dentro dele o endereço de coleta de config/coleta.json. Também gera a
página inicial dist/index.html com a lista de módulos.

Uso:
    python3 scripts/build_site.py                 # usa config/coleta.json
    python3 scripts/build_site.py --coleta-url URL   # sobrescreve (testes)
    python3 scripts/build_site.py --sem-coleta    # gera sem envio automático
"""
import argparse
import html
import json
import re
import shutil
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
MARCA = "''/*COLETA_URL*/"
URL_OK = re.compile(r"^https://script\.google\.com/macros/s/[A-Za-z0-9_-]+/exec$")


def carrega(nome):
    return json.loads((RAIZ / "config" / nome).read_text(encoding="utf-8"))


def pagina_inicial(cfg):
    itens = []
    for m in cfg["modulos"]:
        disp = m.get("status") == "disponivel"
        titulo = html.escape(m["titulo"])
        desc = html.escape(m.get("descricao", ""))
        if disp:
            itens.append(f'<li><a class="card" href="{m["pasta"]}/"><b>{titulo}</b><span>{desc}</span><i>Abrir →</i></a></li>')
        else:
            itens.append(f'<li><div class="card off"><b>{titulo}</b><span>{desc}</span><i>Em preparação</i></div></li>')
    return f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(cfg["titulo"])}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap">
<style>
:root{{--paper:#f5f7f9;--surface:#fff;--ink:#16212c;--muted:#5a6978;--rule:#cfd8e1;--x:#0b7a72;--u:#b3306a;
  --serif:"Newsreader",Georgia,serif;--sans:"IBM Plex Sans",system-ui,sans-serif}}
@media (prefers-color-scheme:dark){{:root{{--paper:#0e141a;--surface:#151e27;--ink:#e4ebf1;--muted:#93a3b2;--rule:#2e3d4d;--x:#3fc6b9;--u:#f07aa8}}}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--paper);color:var(--ink);font:16px/1.55 var(--sans)}}
.wrap{{max-width:760px;margin:0 auto;padding:40px 16px 56px}}
.eyebrow{{margin:0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:500}}
h1{{margin:6px 0 8px;font-family:var(--serif);font-weight:600;font-size:clamp(30px,5vw,42px);line-height:1.1}}
.lede{{margin:0 0 28px;color:var(--muted)}}
ol{{list-style:none;margin:0;padding:0;display:grid;gap:12px;counter-reset:m}}
.card{{display:grid;gap:4px;padding:16px 18px;border:1px solid var(--rule);border-radius:12px;background:var(--surface);color:inherit;text-decoration:none}}
a.card:hover,a.card:focus-visible{{border-color:var(--x);outline:none}}
.card b{{font-family:var(--serif);font-size:21px;font-weight:500}}
.card b::before{{counter-increment:m;content:counter(m) ". ";color:var(--muted)}}
.card span{{color:var(--muted);font-size:14.5px}}
.card i{{font-style:normal;font-size:13.5px;color:var(--x);font-weight:500}}
.card.off{{opacity:.6}} .card.off i{{color:var(--muted)}}
.note{{margin-top:28px;padding-top:14px;border-top:1px solid var(--rule);font-size:13.5px;color:var(--muted)}}
</style>
</head>
<body>
<div class="wrap">
  <p class="eyebrow">{html.escape(cfg.get("instituicao", ""))}</p>
  <h1>{html.escape(cfg["titulo"])}</h1>
  <p class="lede">{html.escape(cfg.get("subtitulo", ""))}</p>
  <ol>
    {"".join(itens)}
  </ol>
  <p class="note">Em cada atividade, informe o código combinado com o professor (não use seu nome) e o seu curso. Ao terminar, clique em <b>Enviar respostas ao professor</b>. As respostas são usadas apenas na pesquisa descrita no Termo de Consentimento.</p>
</div>
</body>
</html>
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--coleta-url")
    ap.add_argument("--sem-coleta", action="store_true")
    ap.add_argument("--saida", default=str(RAIZ / "dist"))
    a = ap.parse_args()

    url = "" if a.sem_coleta else (a.coleta_url if a.coleta_url is not None else carrega("coleta.json").get("url", ""))
    if url and not URL_OK.match(url) and not url.startswith("http://127.0.0.1"):
        sys.exit(f"URL de coleta com formato inesperado: {url}\nEsperado: https://script.google.com/macros/s/<ID>/exec")

    cfg = carrega("modulos.json")
    saida = Path(a.saida)
    if saida.exists():
        shutil.rmtree(saida)
    saida.mkdir(parents=True)

    for m in cfg["modulos"]:
        if m.get("status") != "disponivel":
            continue
        fonte = (RAIZ / m["arquivo"]).read_text(encoding="utf-8")
        if fonte.count(MARCA) != 1:
            sys.exit(f"{m['arquivo']}: marcador {MARCA} não encontrado exatamente uma vez.")
        pronto = fonte.replace(MARCA, json.dumps(url))
        destino = saida / m["pasta"] / "index.html"
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_text(pronto, encoding="utf-8")
        print(f"  {m['pasta']}/index.html  (coleta: {'sim' if url else 'não'})")

    (saida / "index.html").write_text(pagina_inicial(cfg), encoding="utf-8")
    (saida / ".nojekyll").write_text("", encoding="utf-8")
    print(f"Site gerado em {saida}")


if __name__ == "__main__":
    main()
