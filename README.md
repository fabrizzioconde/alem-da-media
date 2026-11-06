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
| `config/` | Endereço da coleta (`coleta.json`), lista de módulos do site (`modulos.json`) e a configuração de cada módulo (`modulos/m1.json`…). |
| `scripts/build_site.py` | Gera o site dos alunos em `dist/` (um módulo por pasta, com o endereço de coleta embutido). |

## Como os módulos são gerados

Os módulos que derivam do roteiro original saem de um único arquivo, `alem-da-media.html`, que guarda um **banco** com todas as perguntas. A configuração de cada módulo (`config/modulos/mN.json`) diz quais perguntas entram e em que ordem, o título, o texto de abertura, os painéis ocultos (`css`) e a versão do registro. O gerador do site embute essa configuração em cada página. Assim, o motor de registro e envio é um só.

**Ferramentas por pergunta:** com `"paineis"` na configuração (pergunta → lista de ferramentas: `dados`, `tijolinhos`, `inversa`, `simulacao`, `graficos`, `mes`), a parte de baixo da página mostra só o que a pergunta aberta usa; perguntas sem entrada não mostram nada. Sem essa chave, tudo fica visível, como no roteiro completo.

**Calculadora:** todos os módulos têm uma calculadora (quatro operações, parênteses, potência, raiz, `Ans`, vírgula decimal), sem funções estatísticas, disponível também no diagnóstico e na verificação. Cada conta é registrada como evento `calculadora` (expressão em `resposta`, valor em `calc_resultado`), e o resumo traz `calc_usos` por pergunta. Para desligar num módulo: `"calculadora": false` na configuração.

Tipos de pergunta: `num`, `choice`, `predict`, `text` e `scale` (1 a 5). O campo `fase` separa `diagnostico` e `verificacao` (uma tentativa, sem dica nem gabarito), `atividade` e `avaliacao`. Sem configuração, o arquivo abre o roteiro completo original, com os mesmos identificadores de pergunta de sempre.

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
- **01/11/2026** — Módulo 1 ("A ilusão da média"), gerado do mesmo arquivo-fonte: perguntas de diagnóstico, verificação e escala; painel do professor separa módulos.
- **02/11/2026** — Calculadora em todos os módulos, com registro das contas.
- **02/11/2026** — Tela de entrada com identificação (uma vez, compartilhada entre os módulos do site); depois, uma linha compacta com "alterar".
- **02/11/2026** — Ferramentas por pergunta no Módulo 1: a seção de dados sai, e os tijolinhos só aparecem nas perguntas que os usam.
- **02/11/2026** — Diagnóstico do Módulo 1 passa a ser conceitual (nenhuma conta antes de trabalhar a média); verificação com pergunta conceitual equivalente e, por último, o cálculo do desvio-padrão; opção "Ainda não sei" no diagnóstico e na verificação.
- **02/11/2026** — Gráfico da perda com os mesmos eixos para ônibus e metrô (a altura do fundo da curva fica comparável) e o valor da perda média ao lado do ponto. Módulo 1: sai "E no metrô?" (repetia o desvio-padrão do metrô), que ganha um comentário ligando-o a √(perda mínima); o comentário da perda mínima do ônibus deixa de antecipar o desvio-padrão. 27 perguntas.
- **06/11/2026** — Reta numérica (gráfico de pontos) nas perguntas de desvio-padrão, ligada à tabela de desvios: pontos, média e cada desvio x − média como um traço. Em "Por que elevar ao quadrado?", metrô e ônibus com as somas dos desvios para cima e para baixo; em "Linha 2: desvio-padrão", as duas linhas na mesma escala.
