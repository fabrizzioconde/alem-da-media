# Como implantar a coleta de respostas no Google

Leva cerca de 5 minutos e é feito uma única vez. Ao final você terá um endereço (URL) que vai dentro dos widgets; a cada clique em **Enviar respostas**, o JSON do aluno chega na sua planilha e numa pasta do seu Google Drive.

## 1. Criar a planilha

1. Acesse [sheets.new](https://sheets.new) com a conta Google que vai receber os dados.
2. Dê um nome, por exemplo **Além da Média – respostas**.

## 2. Colar o script

1. Na planilha, abra **Extensões → Apps Script**.
2. Apague o conteúdo do arquivo `Código.gs` e cole todo o conteúdo de `coleta/apps-script.gs`.
3. Clique no ícone de disquete (**Salvar**).

## 3. Implantar como app da Web

1. Clique em **Implantar → Nova implantação**.
2. Em *Selecione o tipo*, clique na engrenagem e escolha **App da Web**.
3. Preencha:
   - **Descrição:** `coleta v1`
   - **Executar como:** **Eu** (sua conta)
   - **Quem pode acessar:** **Qualquer pessoa**
4. Clique em **Implantar**.
5. O Google pede autorização: **Autorizar acesso** → escolha sua conta → *Avançado* → *Acessar (não seguro)* → **Permitir**. O aviso aparece porque o script é seu e não foi verificado pelo Google; ele só acessa esta planilha e a pasta que ele mesmo cria.
6. Copie o **URL do app da Web** (termina em `/exec`).

## 4. Testar

Abra o URL copiado no navegador. Deve aparecer algo como:

```json
{"ok":true,"servico":"Além da Média – coleta","versoes":["alem-da-media"]}
```

## 5. Enviar o URL

Mande o URL para o Claude, que coloca o endereço em `config/coleta.json`, gera os widgets e publica o site.

## O que "Qualquer pessoa" significa

Qualquer pessoa com o URL consegue **enviar** dados para o script, mas **ninguém consegue ler** a planilha ou a pasta além de você. O script só aceita JSON com o formato dos widgets e de até 5 MB.

## Se precisar mudar o script depois

Edite, salve e use **Implantar → Gerenciar implantações → (lápis) → Versão: Nova versão → Implantar**. Assim o URL continua o mesmo. Se você criar uma *nova implantação*, o URL muda e os widgets precisam ser gerados de novo.

## Onde ficam os dados

| Local | Conteúdo |
|---|---|
| Aba **entregas** | uma linha por envio: aluno, turma, curso, módulo, quantas perguntas respondeu, link do arquivo |
| Aba **resumo** | uma linha por aluno × pergunta, em cada envio |
| Aba **eventos** | uma linha por ação registrada, em cada envio |
| Pasta **Além da Média – respostas recebidas** (Drive) | o JSON completo de cada envio; dá para baixar a pasta e arrastar os arquivos no `painel-professor.html` |

Um aluno pode enviar mais de uma vez. Para a análise, use o envio mais recente de cada aluno (coluna `recebido_em`).

## Privacidade

Os dados ficam na conta Google que implantou o script. Isso deve constar no Termo de Consentimento (TCLE), junto com o uso de códigos no lugar de nomes.
