
# DoLNpcProxyAddon


to use (read / access)
```javascript

// the old way
// still will work same as before
V.NPCName[V.NPCNameList.indexOf("Sydney")].purity

// read by name (same as above)
V.npcs["Sydney"].purity
// read by name (if name only a word) (same as above)
V.npcs.Sydney.purity
// read by index (same as above)
V.npcs[28].purity

// write it value
V.npcs["Sydney"].purity = 100

if( V.npcs.Sydney.purity == 20 ) {
    // ...
}


```

twee
```html
<<if $npcs.Sydney.purity eq 20>>
    // ...
    <<set $npcs.Sydney.purity to 100>>
<<endif>>

<<if $NPCName[$NPCNameList.indexOf("Sydney")].purity eq 20>>
    // ...
    <<set $NPCName[$NPCNameList.indexOf("Sydney")].purity to 100>>
<<endif>>
```

to modify
```javascript
$npcs.Sydney = { /* the npc info to replace old one */ }
```

to add new one (add new one must use this way)
```typescript
// add
window.npcProxyManager.add({
    nam: 'newA',
    love: 100,
    /* the new npc info */
});
// push (same as add)
window.npcProxyManager.push({
    nam: 'newB',
    love: 100,
    /* the new npc info */
});

$npcs['newC'] = {
    nam: 'newC',
    love: 100,
    /* the new npc info */
};

// now the npc `newA` can work as normal
$npcs["newA"]
$npcs.newA.love

// to get the index of `newA`
window.npcProxyManager.getNpcItemRef('newA').index;

```

