import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { CATEGORIES, MEDITATIONS, MeditationCategory, MeditationTrack } from '../../../data/meditations';
import { useThemeColor } from '../../../hooks/use-theme-color';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const NUM_COLUMNS = 2;
const CARD_WIDTH = Math.floor((width - CARD_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS);

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MeditationsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const [selectedCategory, setSelectedCategory] = useState<MeditationCategory | 'all'>('all');

  const filteredMeditations = selectedCategory === 'all'
    ? MEDITATIONS
    : MEDITATIONS.filter(m => m.category === selectedCategory);

  const renderCard = ({ item }: { item: MeditationTrack }) => {
    const category = CATEGORIES[item.category];
    
    return (
      <Animated.View 
        style={styles.cardWrapper}
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(300)}
      >
        <Link href={{
          pathname: "/(tabs)/Meditations/[id]",
          params: { id: item.id }
        }} asChild>
          <Pressable 
            style={({ pressed }) => [
              styles.card, 
              { backgroundColor: pressed ? `${tintColor}10` : backgroundColor },
              pressed && styles.cardPressed
            ]}
          >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                  contentFit="cover"
                  transition={300}
                  placeholder={item.image}
                />
              </View>
            <View style={styles.meta}>
              <View style={styles.categoryRow}>
                <Text style={styles.categoryEmoji}>{category.icon}</Text>
                <Text style={[styles.categoryText, { color: textColor }]}>
                  {category.name}
                </Text>
                <View style={[styles.levelBadge, { backgroundColor: tintColor + '20' }]}>
                  <Text style={[styles.levelText, { color: tintColor }]}>
                    {item.level}
                  </Text>
                </View>
              </View>
              <Text numberOfLines={1} style={[styles.title, { color: textColor }]}>
                {item.title}
              </Text>
              <Text numberOfLines={1} style={[styles.subtitle, { color: textColor + '80' }]}>
                {item.subtitle}
              </Text>
              <View style={styles.playRow}>
                <Link href={{
                  pathname: "/(tabs)/Meditations/[id]",
                  params: { id: item.id }
                }} asChild>
                  <Pressable style={[styles.playButton, { backgroundColor: tintColor }]}>
                    <Text style={styles.playText}>Play</Text>
                  </Pressable>
                </Link>
                <Text style={[styles.durationText, { color: textColor + '80' }]}>
                  {formatTime(item.duration)}
                </Text>
              </View>
            </View>
          </Pressable>
        </Link>
      </Animated.View>
    );
  };

  const renderCategories = () => {
    const categories: (MeditationCategory | 'all')[] = ['all', ...Object.keys(CATEGORIES) as MeditationCategory[]];
    
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <Pressable
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={({ pressed }) => [
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === category 
                  ? tintColor 
                  : pressed 
                    ? `${tintColor}20`
                    : `${tintColor}10`,
              }
            ]}
          >
            <Text style={styles.categoryEmoji}>
              {category === 'all' ? '' : CATEGORIES[category]?.icon}
            </Text>
            <Text 
              style={[
                styles.categoryChipText, 
                { 
                  color: selectedCategory === category 
                    ? '#fff'
                    : textColor
                }
              ]}
            >
              {category === 'all' ? 'All' : CATEGORIES[category]?.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {renderCategories()}
      <FlatList
        contentContainerStyle={styles.list}
        data={filteredMeditations}
        keyExtractor={(i) => i.id}
        renderItem={renderCard}
        numColumns={NUM_COLUMNS}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  list: {
    padding: CARD_MARGIN,
  },
  cardWrapper: {
    margin: CARD_MARGIN / 2,
    width: CARD_WIDTH,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    // shadow (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    // elevation (Android)
    elevation: 3,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  meta: {
    padding: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    opacity: 0.8,
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 12,
  },
  playRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  playText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  durationText: {
    fontSize: 12,
  },
});