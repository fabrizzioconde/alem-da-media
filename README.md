# Além da Média

Roteiro interativo de estatística sobre **média, variação e risco**, com registro das respostas dos alunos e um painel para o professor. Material da disciplina TCC III da Licenciatura em Matemática do INFES/UFF.

> Dois ônibus podem levar o mesmo tempo em média e, mesmo assim, um deles fazer você perder a prova.

## Arquivos

| Arquivo | O que é |
|---|---|
| `alem-da-media.html` | Widget do aluno. Abre em qualquer navegador e funciona offline. |
| `painel-professor.html` | Junta os arquivos `.json` dos alunos e gera tabelas e planilhas. |
| `exemplos/` | 8 arquivos **fictícios** (turma "EXEMPLO") para testar o painel. |
| `LEIA-ME.txt` | Instruções para aluno e professor (versão em texto simples). |
| `coleta/` | Script do Google Apps Script que recebe as respostas numa planilha, e o passo a passo para implantá-lo. |
| `config/` | Endereço da coleta (`coleta.json`) e lista de módulos do site (`modulos.json`). |
| `scripts/build_site.py` | Gera o site dos alunos em `dist/` (um módulo por pasta, com o endereço de coleta embutido). |

## Site dos alunos e coleta automática

Os alunos usam os widgets pelo GitHub Pages, a partir de um repositório público separado (`alem-da-media-site`) que contém só o site gerado. Este repositório, com o código-fonte e a documentação, continua privado.

1. Implante a coleta seguindo `coleta/COMO-IMPLANTAR.md` e coloque o URL em `config/coleta.json`.
2. Gere o site: `python3 scripts/build_site.py`.
3. Publique o conteúdo de `dist/` no repositório `alem-da-media-site`.

No widget, o botão **Enviar respostas ao professor** manda o mesmo JSON que seria baixado. Se o envio falhar, o widget orienta o aluno a baixar o arquivo. Sem URL configurado, o botão não aparece e o widget funciona como antes (só download).

## Uso rápido

**Aluno:** abrir `alem-da-media.html`, preencher código e turma, responder o roteiro e clicar em "Baixar respostas (.json)".

**Professor:** abrir `painel-professor.html` e arrastar os `.json` recebidos. As planilhas exportadas são CSV com `;` e vírgula decimal:

```python
pd.read_csv("arquivo.csv", sep=";", decimal=",")
```

```r
read.csv2("arquivo.csv", fileEncoding = "UTF-8-BOM")
```

Os detalhes do que é registrado estão em `LEIA-ME.txt`.

## Privacidade

Os dados ficam só no navegador do aluno até ele baixar o arquivo. Prefira códigos no lugar de nomes. Se os dados forem usados em pesquisa publicada, é preciso consentimento dos participantes e aprovação no Comitê de Ética (Resolução CNS 510/2016).

## Histórico

- **25/09/2026** — versão 1 (pacote `alem-da-media-pacote.zip`).
- **01/11/2026** — versão 2 do registro: campo Curso, identificação do módulo, envio automático para planilha do Google; painel com filtro por curso; gerador do site.
