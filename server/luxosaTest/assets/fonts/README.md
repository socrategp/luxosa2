# Dossier PDF fonts (server only)

- `NotoSansJP-Regular.otf` — Japanese sections. SIL OFL 1.1 (`NotoSansJP-LICENSE.txt`).
- `jost-latcyr-*.ttf`, `cormorant-garamond-latcyr-*.ttf` — Russian sections. The
  Fontsource `latin` and `cyrillic` subsets of each face merged into one file
  with fontTools `Merger`, renamed `Jost LatCyr` / `Cormorant Garamond LatCyr`
  (PostScript `JostLatCyr-*`, `CormorantGaramondLatCyr-*`). The two subset files
  share one PostScript name, which made the PDF writer embed a new font copy at
  every switch between alphabets. SIL OFL 1.1, no Reserved Font Name
  (`Jost-LICENSE.txt`, `CormorantGaramond-LICENSE.txt`).

To regenerate after a Fontsource update: for each face and weight, load
`@fontsource/<face>/files/<face>-{latin,cyrillic}-<weight>-<style>.woff` with
fontTools, save both as TTF, merge them with `fontTools.merge.Merger`, then set
name IDs 1/16 (family), 4 (full name) and 6 (PostScript name) as above.
