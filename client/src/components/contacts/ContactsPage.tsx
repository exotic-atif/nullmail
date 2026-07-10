import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Star, Trash2, Users, Edit2 } from 'lucide-react';
import { useContactStore } from '@/store/contactStore';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { getInitials, stringToGradient } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';

export function ContactsPage() {
  const store = useContactStore();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const contacts = useMemo(() => {
    let list = store.getFilteredContacts();
    if (filter === 'favorites') list = list.filter((c) => c.isFavorite);
    return list;
  }, [store, filter]);

  const openAdd = () => {
    setEditId(null);
    setName('');
    setEmail('');
    setGroup('');
    setShowModal(true);
  };

  const openEdit = (contact: typeof contacts[0]) => {
    setEditId(contact.id);
    setName(contact.name);
    setEmail(contact.email);
    setGroup(contact.group || '');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    if (editId) {
      store.updateContact(editId, { name: name.trim(), email: email.trim(), group: group || undefined });
      toast.success('Contact updated');
    } else if (user?.id) {
      store.addContact({ name: name.trim(), email: email.trim(), group: group || undefined }, user.id);
      toast.success('Contact added');
    }
    setShowModal(false);
  };

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-nm-text tracking-tight">
            Contacts
          </h1>
          <p className="text-sm text-nm-text-tertiary mt-1">
            {store.contacts.length} contact{store.contacts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" icon={<Plus size={14} />} onClick={openAdd}>
            Add
          </Button>
        </div>
      </motion.div>

      {/* Search + Filter */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-nm-muted" />
          <input
            value={store.searchQuery}
            onChange={(e) => store.setSearchQuery(e.target.value)}
            placeholder="Search contacts…"
            className="w-full bg-nm-surface/50 border border-nm-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-sm text-nm-text placeholder:text-nm-muted outline-none focus:border-nm-accent/30 focus:ring-1 focus:ring-nm-accent/10 transition-all"
          />
        </div>
        <div className="flex bg-nm-surface/50 border border-nm-border-subtle rounded-xl p-0.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filter === 'all' ? 'bg-nm-accent/15 text-nm-accent' : 'text-nm-text-tertiary'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
              filter === 'favorites' ? 'bg-nm-accent/15 text-nm-accent' : 'text-nm-text-tertiary'
            }`}
          >
            <Star size={12} /> Favorites
          </button>
        </div>
      </motion.div>

      {/* Contact List */}
      {contacts.length === 0 ? (
        <EmptyState
          icon={<Users size={24} />}
          title={filter === 'favorites' ? 'No favorite contacts' : 'No contacts yet'}
          description={filter === 'favorites' ? 'Star contacts to see them here' : 'Add contacts to quickly compose emails'}
          action={filter === 'all' ? <Button size="sm" icon={<Plus size={14} />} onClick={openAdd}>Add Contact</Button> : undefined}
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {contacts.map((contact, i) => {
              const groupInfo = store.groups.find((g) => g.id === contact.group);
              return (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-nm-surface/30 border border-nm-border-subtle hover:border-nm-accent/20 transition-all group"
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: stringToGradient(contact.name) }}
                  >
                    {getInitials(contact.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-nm-text truncate">{contact.name}</p>
                      {groupInfo && (
                        <Badge variant="accent">{groupInfo.name}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-nm-text-tertiary truncate">{contact.email}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => store.toggleFavorite(contact.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        contact.isFavorite ? 'text-yellow-400' : 'text-nm-muted hover:text-yellow-400'
                      }`}
                    >
                      <Star size={14} fill={contact.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => openEdit(contact)}
                      className="p-1.5 text-nm-muted hover:text-nm-text rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        store.deleteContact(contact.id);
                        toast.success('Contact deleted');
                      }}
                      className="p-1.5 text-nm-muted hover:text-nm-danger rounded-lg hover:bg-nm-danger/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editId ? 'Edit Contact' : 'Add Contact'}
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-nm-text-secondary uppercase tracking-wider">
              Group
            </label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full bg-nm-surface/50 border border-nm-border-subtle rounded-xl px-4 py-2.5 text-sm text-nm-text outline-none focus:border-nm-accent/30 transition-all"
            >
              <option value="">No group</option>
              {store.groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editId ? 'Save Changes' : 'Add Contact'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
