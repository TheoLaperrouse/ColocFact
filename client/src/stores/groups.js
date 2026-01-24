import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useGroupsStore = defineStore('groups', () => {
  const groups = ref([])
  const currentGroup = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchGroups() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/groups')
      groups.value = response.data.groups
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch groups'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchGroup(id) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/groups/${id}`)
      currentGroup.value = response.data.group
      return response.data.group
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch group'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createGroup(data) {
    const response = await api.post('/groups', data)
    groups.value.push(response.data.group)
    return response.data.group
  }

  async function updateGroup(id, data) {
    const response = await api.put(`/groups/${id}`, data)
    const index = groups.value.findIndex(g => g.id === id)
    if (index !== -1) {
      groups.value[index] = response.data.group
    }
    if (currentGroup.value?.id === id) {
      currentGroup.value = response.data.group
    }
    return response.data.group
  }

  async function deleteGroup(id) {
    await api.delete(`/groups/${id}`)
    groups.value = groups.value.filter(g => g.id !== id)
    if (currentGroup.value?.id === id) {
      currentGroup.value = null
    }
  }

  async function joinGroup(inviteCode) {
    const response = await api.post('/groups/join', { inviteCode })
    groups.value.push(response.data.group)
    return response.data.group
  }

  async function regenerateInviteCode(id) {
    const response = await api.post(`/groups/${id}/invite-code`)
    if (currentGroup.value?.id === id) {
      currentGroup.value.inviteCode = response.data.inviteCode
    }
    return response.data.inviteCode
  }

  async function removeMember(groupId, userId) {
    await api.delete(`/groups/${groupId}/members/${userId}`)
    if (currentGroup.value?.id === groupId) {
      currentGroup.value.members = currentGroup.value.members.filter(m => m.id !== userId)
    }
  }

  async function updateMemberRole(groupId, userId, role) {
    await api.put(`/groups/${groupId}/members/${userId}`, { role })
  }

  return {
    groups,
    currentGroup,
    loading,
    error,
    fetchGroups,
    fetchGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    regenerateInviteCode,
    removeMember,
    updateMemberRole
  }
})
