import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import { theme } from '../../constants/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  useGetTripPlanChecklistByTripIdQuery,
  useUpdateTripPlanChecklistMutation,
} from '../../redux/slices/tripplan/checklistSlice';
import ConfirmationDialog from '../../components/ConfirmationDialog';

interface ChecklistItem {
  id: string;
  description: string;
  isChecked: boolean;
}

interface CheckListScreenProps {
  tripId: string;
  trip_id: string;
}

const CheckListScreen: React.FC<CheckListScreenProps> = ({ tripId, trip_id }) => {
  if (!trip_id) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Missing trip ID</Text>
      </View>
    );
  }

  const { data, isLoading, refetch } =
    useGetTripPlanChecklistByTripIdQuery(trip_id);
  const [updateTripPlanChecklist] = useUpdateTripPlanChecklistMutation();

  const [checklistId, setChecklistId] = useState('');
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    console.log(data);

    if (data?.id) {
      setChecklistId(data.id);
    }
    if (data?.checklist) {
      setItems(
        data.checklist.map((item: any) => ({
          id: item.id || Date.now().toString(),
          description: item.description,
          isChecked: item.isChecked || false,
        })),
      );
    }
  }, [data]);

  const handleAddItem = async () => {
    if (!newItem.trim()) return;

    const newChecklistItem = {
      id: new Date().toISOString(),
      description: newItem.trim(),
      isChecked: false,
    };

    try {
      const updatedChecklist = [...items, newChecklistItem];
      await updateTripPlanChecklist({
        id: checklistId,
        data: {
          tripId: trip_id,
          checklist: updatedChecklist,
        },
      });
      setItems(updatedChecklist);
      setNewItem('');
      refetch();
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const handleToggleItem = async (id: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item,
    );

    try {
      await updateTripPlanChecklist({
        id: checklistId,
        data: {
          tripId: trip_id,
          checklist: updatedItems,
        },
      });
      setItems(updatedItems);
      refetch();
    } catch (error) {
      console.error('Failed to toggle item:', error);
    }
  };

  const handleDeletePress = (id: string) => {
    setItemToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const filteredItems = items.filter(item => item.id !== itemToDelete);
      await updateTripPlanChecklist({
        id: checklistId,
        data: {
          tripId: trip_id,
          checklist: filteredItems,
        },
      });
      setItems(filteredItems);
      setItemToDelete(null);
      refetch();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new item"
          value={newItem}
          onChangeText={setNewItem}
          onSubmitEditing={handleAddItem}
          returnKeyType="done"
        />
        <TouchableOpacity
          onPress={handleAddItem}
          disabled={!newItem.trim()}
          style={[
            styles.addButton,
            !newItem.trim() && styles.addButtonDisabled,
          ]}>
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No checklist items to show</Text>
            <Text style={styles.emptySubText}>Add items to your checklist</Text>
          </View>
        ) : (
          items.map(item => (
            <View key={item.id} style={styles.itemContainer}>
              <TouchableOpacity
                style={styles.itemContent}
                onPress={() => handleToggleItem(item.id)}>
                <Checkbox
                  status={item.isChecked ? 'checked' : 'unchecked'}
                  onPress={() => handleToggleItem(item.id)}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.itemText,
                    item.isChecked && styles.completedItemText,
                  ]}>
                  {item.description}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeletePress(item.id)}
                style={styles.deleteButton}>
                <MaterialIcons
                  name="delete-outline"
                  size={22}
                  color="#FF4444"
                />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <ConfirmationDialog
        key={itemToDelete}
        visible={!!itemToDelete}
        onDismiss={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonStyle="danger"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: 'space-between',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  completedItemText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default CheckListScreen;
