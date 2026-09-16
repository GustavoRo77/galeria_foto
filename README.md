# Minha Galeria

Aplicativo mobile desenvolvido com Ionic Vue e Capacitor para registrar, visualizar e compartilhar fotos do dispositivo.

## Identificação

- **Nome do aluno:** Gustavo Pereira
- **Nome do curso:** Informática
- **Unidade curricular:** Codificar aplicações para dispositivos móveis

## Projeto

O Minha Galeria possui cadastro e login local, com acesso à tela inicial protegido por autenticação. Nela, o usuário pode tirar fotos, selecionar imagens da galeria, removê-las e compartilhá-las com outros aplicativos, como WhatsApp e Telegram, pelo menu nativo do Android.

Na tela **Sobre**, o aplicativo informa o status da conexão com a internet, solicita a localização do dispositivo e exibe latitude, longitude e altitude. Também há um controle de modo escuro cuja escolha fica salva nas preferências do dispositivo.

As permissões são solicitadas somente quando necessárias: câmera, fotos/galeria e localização. Os dados de acesso e a preferência de tema ficam no armazenamento local do dispositivo; as fotos ficam disponíveis durante a sessão atual.

## Como rodar

### Pré-requisitos

- Node.js 20 ou superior;
- Android Studio configurado, para executar no Android.

### Navegador

```bash
npm install
npm run dev
```

Abra o endereço exibido pelo Vite. Câmera, compartilhamento e localização podem ter limitações no navegador; a entrega deve ser validada em um emulador ou aparelho Android.

### Android Studio

```bash
npm install
npm run build
npx cap sync android
npx cap open android
```

No Android Studio, aguarde a sincronização do Gradle, conecte um dispositivo ou inicie um emulador e pressione **Run**. Aceite as permissões solicitadas ao usar câmera, galeria e localização.

## Repositório

Publique este diretório em um repositório público no GitHub e inclua aqui o link da entrega após a publicação.
