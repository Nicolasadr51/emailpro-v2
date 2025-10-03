import React, { useState } from 'react';
import { PageWrapper } from '../components/layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui';
import { useContacts, useDeleteContact } from '../hooks/useContacts';
import { Contact } from '../types/contact';
import { Link } from 'react-router-dom';
import { PlusIcon, SearchIcon, TrashIcon, EditIcon } from 'lucide-react';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { Badge } from '../components/ui/Badge';
import { format } from 'date-fns';

export const ContactListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError, error } = useContacts({ search }, page, limit);
  const deleteContactMutation = useDeleteContact();

  const contacts = data?.data || [];
  const pagination = data?.pagination;

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    if (pagination && page < pagination.totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const canGoPrevious = page > 1;
  const canGoNext = pagination ? page < pagination.totalPages : false;

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      deleteContactMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingOverlay />;
  if (isError) return <PageWrapper title="Contacts" breadcrumbs={[{ label: 'Contacts' }]}><p>Erreur: {error?.message}</p></PageWrapper>;

  return (
    <PageWrapper
      title="Contacts"
      breadcrumbs={[{ label: 'Contacts' }]}
      actions={[
        <Link to="/contacts/new">
          <Button><PlusIcon className="mr-2 h-4 w-4" /> Nouveau Contact</Button>
        </Link>,
      ]}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des contacts..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Listes</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">Aucun contact trouvé.</TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.email}</TableCell>
                  <TableCell>{contact.firstName}</TableCell>
                  <TableCell>{contact.lastName}</TableCell>
                  <TableCell>
                    <Badge variant={contact.status === 'subscribed' ? 'success' : 'destructive'}>
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{contact.listIds?.join(', ') || 'N/A'}</TableCell>
                  <TableCell>
                    {contact.tags?.map(tag => <Badge key={tag} variant="secondary" className="mr-1">{tag}</Badge>)}
                  </TableCell>
                  <TableCell>{format(new Date(contact.createdAt), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <Link to={`/contacts/${contact.id}`}>
                      <Button variant="ghost" size="sm" className="mr-2"><EditIcon className="h-4 w-4" /></Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(contact.id)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!canGoPrevious}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!canGoNext}
          >
            Suivant
          </Button>
        </div>
      )}
    </PageWrapper>
  );
};

