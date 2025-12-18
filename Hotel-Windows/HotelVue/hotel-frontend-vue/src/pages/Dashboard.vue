<!-- src/pages/Dashboard.vue -->
<template>
  <div
    :style="{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    }"
  >
    <!-- Sidebar -->
    <aside
      :style="{
        width: '280px',
        background: 'linear-gradient(180deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '2rem 0',
        boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }"
    >
      <!-- Header sidebar -->
      <div
        :style="{
          padding: '0 2rem 2rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '2rem'
        }"
      >
        <div
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.5rem'
          }"
        >
          <Hotel :size="32" :stroke-width="2" />
          <h2
            :style="{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }"
          >
            Hotel Admin
          </h2>
        </div>
        <p
          :style="{
            margin: '0.5rem 0 0',
            fontSize: '0.875rem',
            opacity: 0.8,
            fontWeight: '300'
          }"
        >
          Sistema de Gestión
        </p>
      </div>

<!-- Menu items -->
<nav :style="{ flex: 1, padding: '0 1rem' }">
  <RouterLink
    v-for="item in menuItems"
    :key="item.path"
    :to="item.path"
    :style="linkStyle"
    @mouseenter="onLinkEnter"
    @mouseleave="onLinkLeave"
  >
    <component :is="item.icon" :size="20" />
    {{ item.label }}
  </RouterLink>
</nav>


      <!-- Logout -->
      <div :style="{ padding: '1rem' }">
        <button
          @click="handleLogout"
          :style="logoutStyle"
          @mouseenter="onLogoutEnter"
          @mouseleave="onLogoutLeave"
        >
          <LogOut :size="18" />
          Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main
      :style="{
        flex: 1,
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }"
    >
      <div
        :style="{
          background: 'white',
          borderRadius: '16px',
          padding: '3rem',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }"
      >
        <div
          :style="{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
          }"
        >
          <Hotel :size="40" color="white" :stroke-width="2" />
        </div>

        <h1
          :style="{
            margin: '0 0 1rem',
            fontSize: '2rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }"
        >
          Bienvenido al Sistema
        </h1>

        <p
          :style="{
            margin: 0,
            fontSize: '1.125rem',
            color: '#64748b',
            lineHeight: '1.6'
          }"
        >
          Selecciona un módulo del menú lateral para comenzar a gestionar tu hotel
        </p>

        <!-- Stats -->
        <div
          :style="{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginTop: '2rem'
          }"
        >
          <div
            v-for="(stat, i) in stats"
            :key="i"
            :style="{
              padding: '1.25rem',
              background: stat.color + '10',
              borderRadius: '12px',
              border: '1px solid ' + stat.color + '20'
            }"
          >
            <ponent
              :is="stat.icon"
              :size="24"
              :color="stat.color"
              :style="{ marginBottom: '0.5rem' }"
            />
            <p
              :style="{
                margin: 0,
                fontSize: '0.875rem',
                color: '#64748b',
                fontWeight: '500'
              }"
            >
              {{ stat.label }}
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter, RouterLink } from 'vue-router'
import {
  Hotel,
  Calendar,
  CreditCard,
  FileCheck,
  DoorOpen,
  Users,
  LogOut,
  Sparkles
} from 'lucide-vue-next'

const router = useRouter()

const menuItems = [
  { path: '/reservas', icon: Calendar, label: 'Reservas' },
  { path: '/habitaciones', icon: DoorOpen, label: 'Habitaciones' },
  { path: '/habitaciones/crear', icon: Sparkles, label: 'Nueva Habitación' },
  { path: '/huespedes', icon: Users, label: 'Huéspedes' },
    { path: '/reportes', icon: Users, label: 'Reportes Eventos' },


]

const stats = [
  { icon: Calendar, label: 'Reservas', color: '#3b82f6' },
  { icon: DoorOpen, label: 'Habitaciones', color: '#8b5cf6' },
  { icon: Users, label: 'Huéspedes', color: '#ec4899' },
    { icon: Users, label: 'Reportes', color: '#ec4899' },


]

const linkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.875rem 1rem',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '8px',
  marginBottom: '0.5rem',
  transition: 'all 0.2s ease',
  fontSize: '0.95rem',
  fontWeight: '400'
}

const logoutStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.75rem',
  padding: '0.875rem',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  color: 'white',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.95rem',
  fontWeight: '500',
  transition: 'all 0.2s ease'
}

const onLinkEnter = e => {
  e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
  e.currentTarget.style.transform = 'translateX(4px)'
}

const onLinkLeave = e => {
  e.currentTarget.style.background = 'transparent'
  e.currentTarget.style.transform = 'translateX(0)'
}

const onLogoutEnter = e => {
  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)'
}

const onLogoutLeave = e => {
  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
}

const handleLogout = () => {
  localStorage.removeItem('usuario')
  router.push('/')
}
</script>
