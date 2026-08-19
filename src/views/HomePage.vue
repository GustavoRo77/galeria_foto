<template>
  <ion-page>
    <ion-header><ion-toolbar color="primary"><ion-title>Minha Galeria</ion-title><ion-buttons slot="end"><ion-button aria-label="Sobre o app" @click="router.push('/sobre')"><ion-icon slot="icon-only" :icon="informationCircleOutline" /></ion-button><ion-button aria-label="Sair" @click="signOut"><ion-icon slot="icon-only" :icon="logOutOutline" /></ion-button></ion-buttons></ion-toolbar></ion-header>
    <ion-content>
      <section class="welcome ion-padding"><h1>Olá, {{ userName }}!</h1><p>{{ photos.length ? `${photos.length} foto(s) na sua galeria.` : 'Use o botão + para adicionar fotos.' }}</p></section>
      <section v-if="photos.length" class="photo-grid ion-padding-horizontal"><article v-for="photo in photos" :key="photo.id" class="photo-card"><img :src="photo.url" alt="Foto adicionada à galeria" /><ion-button class="remove-button" color="danger" size="small" shape="round" aria-label="Remover foto" @click="remove(photo.id)"><ion-icon slot="icon-only" :icon="trashOutline" /></ion-button></article></section>
      <section v-else class="empty-state"><ion-icon :icon="imagesOutline" /><h2>Sua galeria está vazia</h2><p>Adicione uma foto da câmera ou da galeria do dispositivo.</p></section>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end"><ion-fab-button aria-label="Adicionar foto"><ion-icon :icon="add" /></ion-fab-button><ion-fab-list side="top"><ion-fab-button color="secondary" aria-label="Escolher da galeria" @click="chooseFromGallery"><ion-icon :icon="imagesOutline" /></ion-fab-button><ion-fab-button color="tertiary" aria-label="Tirar foto" @click="takePhoto"><ion-icon :icon="cameraOutline" /></ion-fab-button></ion-fab-list></ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'; import { useRouter } from 'vue-router';
import { Camera, MediaTypeSelection } from '@capacitor/camera';
import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, toastController } from '@ionic/vue';
import { add, cameraOutline, imagesOutline, informationCircleOutline, logOutOutline, trashOutline } from 'ionicons/icons';
import { currentUserName, logout } from '@/services/auth';
type GalleryPhoto = { id: string; url: string }; const router = useRouter(); const userName = currentUserName(); const photos = ref<GalleryPhoto[]>([]);
function addPhoto(url?: string) { if (url) photos.value.unshift({ id: crypto.randomUUID(), url }); }
async function takePhoto() { try { const permission = await Camera.requestPermissions({ permissions: ['camera'] }); if (permission.camera !== 'granted') return notify('Permissão da câmera negada.', 'danger'); const photo = await Camera.takePhoto({ quality: 85, targetWidth: 1400, correctOrientation: true }); addPhoto(photo.webPath); } catch (error) { if (!String(error).toLowerCase().includes('cancel')) notify('Não foi possível tirar a foto.', 'danger'); } }
async function chooseFromGallery() { try { const permission = await Camera.requestPermissions({ permissions: ['photos'] }); if (permission.photos !== 'granted' && permission.photos !== 'limited') return notify('Permissão para fotos negada.', 'danger'); const result = await Camera.chooseFromGallery({ mediaType: MediaTypeSelection.Photo, allowMultipleSelection: true, quality: 85, targetWidth: 1400 }); result.results.forEach((photo) => addPhoto(photo.webPath)); } catch (error) { if (!String(error).toLowerCase().includes('cancel')) notify('Não foi possível abrir a galeria.', 'danger'); } }
function remove(id: string) { photos.value = photos.value.filter((photo) => photo.id !== id); }
function signOut() { logout(); router.replace('/login'); }
async function notify(message: string, color: string) { const toast = await toastController.create({ message, color, duration: 2200, position: 'bottom' }); await toast.present(); }
</script>

<style scoped>
.welcome h1 { margin: 8px 0 4px; font-size: 26px; }.welcome p { color: #64748b; margin: 0; }.photo-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding-bottom: 90px; }.photo-card { aspect-ratio: 1; position: relative; overflow: hidden; border-radius: 14px; background: #e8eef8; }.photo-card img { width: 100%; height: 100%; object-fit: cover; }.remove-button { position: absolute; top: 6px; right: 6px; margin: 0; --padding-start: 7px; --padding-end: 7px; }.empty-state { text-align: center; color: #64748b; padding: 70px 32px; }.empty-state ion-icon { color: var(--ion-color-primary); font-size: 64px; }.empty-state h2 { color: #24344d; font-size: 21px; } @media (min-width: 600px) { .photo-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); max-width: 900px; margin: auto; } }
</style>
