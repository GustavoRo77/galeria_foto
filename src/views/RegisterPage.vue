<template>
  <ion-page>
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-back-button default-href="/login" /></ion-buttons><ion-title>Criar conta</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <main class="form-container">
        <p>Crie seu acesso para começar a montar sua galeria.</p>
        <ion-list inset>
          <ion-item><ion-input v-model="name" label="Nome" label-placement="stacked" placeholder="Seu nome" /></ion-item>
          <ion-item><ion-input v-model="email" type="email" label="E-mail" label-placement="stacked" placeholder="voce@email.com" /></ion-item>
          <ion-item><ion-input v-model="password" type="password" label="Senha" label-placement="stacked" placeholder="Mínimo de 6 caracteres" /></ion-item>
          <ion-item><ion-input v-model="confirmation" type="password" label="Confirmar senha" label-placement="stacked" placeholder="Repita a senha" /></ion-item>
        </ion-list>
        <ion-button expand="block" @click="submit">Cadastrar</ion-button>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'; import { useRouter } from 'vue-router';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonList, IonPage, IonTitle, IonToolbar, toastController } from '@ionic/vue';
import { register } from '@/services/auth';
const router = useRouter(); const name = ref(''); const email = ref(''); const password = ref(''); const confirmation = ref('');
async function submit() {
  if (!name.value || !email.value || !password.value) return notify('Preencha todos os campos.', 'warning');
  if (password.value.length < 6) return notify('A senha deve ter ao menos 6 caracteres.', 'warning');
  if (password.value !== confirmation.value) return notify('As senhas não coincidem.', 'warning');
  const result = register({ name: name.value.trim(), email: email.value.trim(), password: password.value });
  if (!result.ok) return notify(result.message!, 'danger');
  await notify('Cadastro realizado. Faça login para continuar.', 'success'); await router.replace('/login');
}
async function notify(message: string, color: string) { const toast = await toastController.create({ message, color, duration: 2200, position: 'bottom' }); await toast.present(); }
</script>
<style scoped>.form-container { max-width: 520px; margin: 20px auto; color: #53657d; }</style>
