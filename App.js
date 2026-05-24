import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  Modal, StyleSheet, FlatList, SafeAreaView, StatusBar,
} from 'react-native';

// ── Background images (base64) ──
const EQUIP_IMG = require('./images/equip.jpeg');
const RUNES_IMG = require('./images/runes.jpeg');
const CHARS_IMG = require('./images/chars.jpeg');

// Image aspect ratios (width / height)
const RATIOS = { equip: 1.1607, runes: 1.3619, chars: 2.0124 };

// ── Item Database ──
const ITEMS = {
  weapon:   [{ id:"w1", name:"Weapon 1", img:"" },{ id:"w2", name:"Weapon 2", img:"" },{ id:"w3", name:"Weapon 3", img:"" }],
  helmet:   [{ id:"hm1", name:"Helmet 1", img:"" },{ id:"hm2", name:"Helmet 2", img:"" },{ id:"hm3", name:"Helmet 3", img:"" }],
  necklace: [{ id:"am1", name:"Amulet 1", img:"" },{ id:"am2", name:"Amulet 2", img:"" },{ id:"am3", name:"Amulet 3", img:"" }],
  armor:    [{ id:"ar1", name:"Armor 1", img:"" },{ id:"ar2", name:"Armor 2", img:"" },{ id:"ar3", name:"Armor 3", img:"" }],
  ring:     [{ id:"rn1", name:"Ring 1", img:"" },{ id:"rn2", name:"Ring 2", img:"" },{ id:"rn3", name:"Ring 3", img:"" }],
  boots:    [{ id:"bt1", name:"Boots 1", img:"" },{ id:"bt2", name:"Boots 2", img:"" },{ id:"bt3", name:"Boots 3", img:"" }],
};

// ── Slot Definitions (% of image size) ──
const SLOTS = {
  equip: [
    { id:"weapon",   category:"weapon",   top:4.6,  left:2.3,  right:null, w:21, h:24 },
    { id:"helmet",   category:"helmet",   top:4.6,  left:null, right:3.1,  w:21, h:24 },
    { id:"necklace", category:"necklace", top:36.2, left:2.2,  right:null, w:21, h:24 },
    { id:"armor",    category:"armor",    top:36,   left:null, right:3,    w:21, h:24 },
    { id:"ring",     category:"ring",     top:67.3, left:2.3,  right:null, w:21, h:24 },
    { id:"boots",    category:"boots",    top:67.5, left:null, right:2.9,  w:21, h:24 },
  ],
  runes: [
    { id:"hex1",  top:12.6, left:10.3, right:null, w:13, h:18 },
    { id:"hex2",  top:31.6, left:3,    right:null, w:13, h:18 },
    { id:"hex3",  top:53,   left:2.2,  right:null, w:13, h:18 },
    { id:"hex4",  top:71.1, left:9.9,  right:null, w:13, h:18 },
    { id:"star1", top:12.2, left:null, right:10.9, w:13, h:18 },
    { id:"star2", top:30,   left:null, right:3.4,  w:13, h:18 },
    { id:"star3", top:51.9, left:null, right:2.7,  w:13, h:18 },
    { id:"star4", top:71,   left:null, right:10.3, w:13, h:18 },
    { id:"oct1",  top:41.6, left:19.7, right:null, w:12, h:17 },
    { id:"oct2",  top:41.8, left:null, right:19.7, w:12, h:17 },
    { id:"dia1",  top:69.3, left:27.7, right:null, w:12, h:18 },
    { id:"dia2",  top:69.3, left:43.9, right:null, w:12, h:18 },
    { id:"dia3",  top:69.2, left:null, right:28.3, w:12, h:18 },
  ],
  chars: [
    { id:"deployed",  category:null, top:23.5, left:4.7,  right:null, w:20.5, h:44 },
    { id:"res1",      category:null, top:23.5, left:28,   right:null, w:20.5, h:44 },
    { id:"res2",      category:null, top:23.6, left:51.4, right:null, w:20.5, h:44 },
    { id:"mystling",  category:null, top:25.1, left:76.2, right:null, w:17.5, h:42.5, shape:"oval" },
    { id:"dep-sub1",  category:null, top:68.2, left:4.1,  right:null, w:11,   h:22 },
    { id:"dep-sub2",  category:null, top:68.4, left:14.7, right:null, w:11,   h:22 },
    { id:"res1-sub1", category:null, top:68.5, left:27.5, right:null, w:11,   h:22 },
    { id:"res1-sub2", category:null, top:68.6, left:38,   right:null, w:11,   h:22 },
    { id:"res2-sub1", category:null, top:68.1, left:50.9, right:null, w:11,   h:22 },
    { id:"res2-sub2", category:null, top:68,   left:61,   right:null, w:11,   h:22 },
  ],
};

// ── Item Picker Modal ──
function ItemPicker({ category, onSelect, onClose, onClear, current }) {
  const items = ITEMS[category] || [];
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={s.pickerSheet}>
          <View style={s.pickerHeader}>
            <Text style={s.pickerTitle}>
              Select {category}
            </Text>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <Text style={s.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {items.length === 0 ? (
            <Text style={s.emptyText}>No items yet for this slot</Text>
          ) : (
            <FlatList
              data={items}
              numColumns={3}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingBottom: 8 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[s.itemCard, current === item.id && s.itemCardActive]}
                  onPress={() => onSelect(item)}
                >
                  {item.img
                    ? <Image source={{ uri: item.img }} style={s.itemThumb} />
                    : <View style={[s.itemThumb, s.itemThumbEmpty]}>
                        <Text style={{ color:"#555", fontSize:10 }}>No img</Text>
                      </View>
                  }
                  <Text style={s.itemLabel}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {current && (
            <TouchableOpacity style={s.clearBtn} onPress={onClear}>
              <Text style={s.clearBtnText}>🗑 Remove item</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ── Section: background image + clickable slots ──
function Section({ sectionKey, imgSrc, slots, filled, onTap }) {
  const ratio = RATIOS[sectionKey];
  return (
    <View style={[s.section, { aspectRatio: ratio }]}>
      <Image source={imgSrc} style={s.bgImage} resizeMode="stretch" />
      {slots.map(slot => {
        const itemId = filled[slot.id];
        const item = itemId ? (ITEMS[slot.category] || []).find(i => i.id === itemId) : null;
        const isOval = slot.shape === "oval";

        const posStyle = {
          position: "absolute",
          top:    `${slot.top}%`,
          width:  `${slot.w}%`,
          aspectRatio: slot.w / slot.h,
          borderRadius: isOval ? 999 : 8,
        };
        if (slot.left  !== null) posStyle.left  = `${slot.left}%`;
        if (slot.right !== null) posStyle.right = `${slot.right}%`;

        return (
          <TouchableOpacity
            key={slot.id}
            style={[s.slot, posStyle]}
            onPress={() => slot.category && onTap(slot)}
            activeOpacity={slot.category ? 0.6 : 1}
          >
            {item?.img ? (
              <Image source={{ uri: item.img }} style={s.slotImg} resizeMode="contain" />
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Main App ──
export default function App() {
  const [filled, setFilled] = useState({});
  const [picker, setPicker] = useState(null);

  const handleTap = (slot) => setPicker({ slotId: slot.id, category: slot.category });

  const handleSelect = (item) => {
    setFilled(prev => ({ ...prev, [picker.slotId]: item.id }));
    setPicker(null);
  };

  const handleClear = () => {
    setFilled(prev => { const n = { ...prev }; delete n[picker.slotId]; return n; });
    setPicker(null);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#111122" />
      <ScrollView contentContainerStyle={s.scroll}>

        <Text style={s.title}>⚔️ Archero 2 Builder</Text>
        <Text style={s.subtitle}>Tap a slot to select an item</Text>

        <Section sectionKey="equip" imgSrc={EQUIP_IMG} slots={SLOTS.equip} filled={filled} onTap={handleTap} />
        <Section sectionKey="runes" imgSrc={RUNES_IMG} slots={SLOTS.runes} filled={filled} onTap={handleTap} />
        <Section sectionKey="chars" imgSrc={CHARS_IMG} slots={SLOTS.chars} filled={filled} onTap={handleTap} />

        <View style={{ height: 40 }} />
      </ScrollView>

      {picker && (
        <ItemPicker
          category={picker.category}
          current={filled[picker.slotId]}
          onSelect={handleSelect}
          onClose={() => setPicker(null)}
          onClear={handleClear}
        />
      )}
    </SafeAreaView>
  );
}

// ── Styles ──
const s = StyleSheet.create({
  safe:      { flex:1, backgroundColor:"#111122" },
  scroll:    { padding:12 },
  title:     { color:"#FFD966", fontSize:22, fontWeight:"900", textAlign:"center", marginBottom:4 },
  subtitle:  { color:"#a0a8c0", fontSize:13, textAlign:"center", marginBottom:16 },

  section:   { width:"100%", marginBottom:14, position:"relative", borderRadius:16, overflow:"hidden" },
  bgImage:   { position:"absolute", top:0, left:0, right:0, bottom:0 },
  slot:      { backgroundColor:"transparent", overflow:"hidden", justifyContent:"center", alignItems:"center" },
  slotImg:   { width:"100%", height:"100%" },

  modalOverlay: { flex:1, backgroundColor:"rgba(0,0,0,0.75)", justifyContent:"flex-end" },
  pickerSheet:  { backgroundColor:"#1a1635", borderTopLeftRadius:20, borderTopRightRadius:20,
                  padding:20, paddingBottom:36, borderWidth:2, borderColor:"#4a3d7a",
                  maxHeight:"70%" },
  pickerHeader: { flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:16 },
  pickerTitle:  { color:"#FFD966", fontWeight:"800", fontSize:17, textTransform:"capitalize" },
  closeBtn:     { backgroundColor:"#2a2a4a", borderRadius:20, paddingHorizontal:16, paddingVertical:6 },
  closeBtnText: { color:"#a0a8d0", fontWeight:"800", fontSize:14 },
  emptyText:    { color:"#a0a8c0", textAlign:"center", paddingVertical:24, fontSize:14 },

  itemCard:       { flex:1, margin:6, alignItems:"center", borderRadius:14, padding:6,
                    borderWidth:2, borderColor:"transparent", backgroundColor:"rgba(255,255,255,0.04)" },
  itemCardActive: { borderColor:"#FFD966", backgroundColor:"rgba(255,215,80,0.12)" },
  itemThumb:      { width:72, height:72, borderRadius:10, objectFit:"contain" },
  itemThumbEmpty: { backgroundColor:"#2a2a4a", justifyContent:"center", alignItems:"center" },
  itemLabel:      { fontSize:11, color:"#c9aaff", fontWeight:"700", textAlign:"center",
                    marginTop:4, lineHeight:14 },

  clearBtn:     { marginTop:18, padding:14, borderRadius:50, backgroundColor:"#2d1a1a", alignItems:"center" },
  clearBtnText: { color:"#f87171", fontWeight:"800", fontSize:14 },
});
