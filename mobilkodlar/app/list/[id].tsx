import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useWordListStore } from '@/store/wordlist-store';
import WordCard from '@/components/WordCard';
import EmptyState from '@/components/EmptyState';
import ProgressBar from '@/components/ProgressBar';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Brain, 
  Award, 
  BookOpen,
  Search,
  SortAsc,
  SortDesc,
  Languages
} from 'lucide-react-native';
import Input from '@/components/Input';
import tr from '@/constants/localization';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getList, currentList, deleteList, deleteWord, learningProgress } = useWordListStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  useEffect(() => {
    if (id) {
      getList(id);
    }
  }, [id]);
  
  const onRefresh = async () => {
    setRefreshing(true);
    if (id) {
      await getList(id);
    }
    setRefreshing(false);
  };
  
  const handleDeleteList = () => {
    Alert.alert(
      tr.deleteList,
      tr.deleteListConfirm,
      [
        {
          text: tr.cancel,
          style: "cancel"
        },
        {
          text: tr.delete,
          onPress: async () => {
            if (id) {
              await deleteList(id);
              router.back();
            }
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleDeleteWord = (wordId: string) => {
    Alert.alert(
      tr.deleteWord,
      tr.deleteWordConfirm,
      [
        {
          text: tr.cancel,
          style: "cancel"
        },
        {
          text: tr.delete,
          onPress: async () => {
            if (id) {
              await deleteWord(id, wordId);
            }
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleEditWord = (word: any) => {
    if (id) {
      router.push(`/word/edit/${id}/${word.id}`);
    }
  };
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  // Filter and sort words based on search query and sort order
  const filteredWords = currentList?.words
    .filter(word => 
      word.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.term.localeCompare(b.term);
      } else {
        return b.term.localeCompare(a.term);
      }
    }) || [];
  
  // Get learning progress for this list
  const progress = id ? learningProgress[id] : undefined;
  
  // Safely get language display name
  const getLanguageDisplay = (languageCode: string | undefined) => {
    if (!languageCode) return 'Unknown';
    
    // Check if the language exists in our translations
    if (tr.languages && typeof tr.languages === 'object' && languageCode in tr.languages) {
      return tr.languages[languageCode as keyof typeof tr.languages];
    }
    
    // Fallback to the language code itself
    return languageCode;
  };
  
  if (!currentList) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <EmptyState
          title="Liste Bulunamadı"
          message="Aradığınız liste mevcut değil veya silinmiş."
          icon={<BookOpen size={48} color={colors.primary} />}
          actionLabel={tr.goBack}
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <Stack.Screen 
        options={{
          title: currentList.name,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push(`/list/edit/${id}`)}
              >
                <Edit size={20} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleDeleteList}
              >
                <Trash2 size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <View style={styles.listInfoCard}>
        <Text style={styles.listDescription}>{currentList.description}</Text>
        
        <View style={styles.listMetaContainer}>
          <View style={styles.listMetaItem}>
            <Languages size={16} color={colors.textSecondary} />
            <Text style={styles.listMetaText}>
              {getLanguageDisplay(currentList.language)}
            </Text>
          </View>
          
          <View style={styles.listMetaItem}>
            <Text style={styles.listMetaText}>{currentList.wordCount} kelime</Text>
          </View>
        </View>
        
        {progress && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Hakimiyet İlerlemesi</Text>
            <ProgressBar 
              progress={progress.masteryAverage} 
              height={8}
              showPercentage
              color={colors.primary}
            />
          </View>
        )}
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.learnButton]}
            onPress={() => router.push(`/learn/${id}`)}
          >
            <Brain size={18} color="white" />
            <Text style={styles.actionButtonText}>{tr.learningMode}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.quizButton]}
            onPress={() => router.push(`/quiz/${id}`)}
          >
            <Award size={18} color="white" />
            <Text style={styles.actionButtonText}>{tr.quizMode}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.wordsHeader}>
        <Text style={styles.wordsTitle}>Kelimeler</Text>
        
        <View style={styles.wordsActions}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={toggleSortOrder}
          >
            {sortOrder === 'asc' ? (
              <SortAsc size={20} color={colors.text} />
            ) : (
              <SortDesc size={20} color={colors.text} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push(`/word/add/${id}`)}
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Input
        placeholder="Kelimeleri ara..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon={<Search size={20} color={colors.textSecondary} />}
        containerStyle={styles.searchContainer}
      />
      
      <FlatList
        data={filteredWords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WordCard
            word={item}
            onEdit={handleEditWord}
            onDelete={handleDeleteWord}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title={tr.noWordsFound}
            message={searchQuery ? tr.tryDifferentSearch : tr.addWordsToStart}
            icon={<BookOpen size={48} color={colors.primary} />}
            actionLabel={searchQuery ? undefined : tr.addWord}
            onAction={searchQuery ? undefined : () => router.push(`/word/add/${id}`)}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  listInfoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listDescription: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  listMetaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  listMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listMetaText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  learnButton: {
    backgroundColor: colors.primary,
  },
  quizButton: {
    backgroundColor: colors.secondary,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  wordsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  wordsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  wordsActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sortButton: {
    padding: 4,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
});