## Bugs

- WithUpdate : [key: string]: any (WTF ?)
- Line constructor : move out somehow ?

## Features

- .data instead of .value / see .setProperties...
- 1 component to add (scale)
- 6 curves to add (+ tests)

- register chart controlers...

## Interactive

- name + get component/dataset by name ?

- 5 components to add (zoom, datalabel, tooltip)
- onRemove()
- properties : value as function or signal-compatible object.
- SharedProperties (how ?)
- Update ChartHTML

## Usage

- properties = null => set default.

- "@ChartJS".
- doc (ofc)
- other node manipulation fonctions (.remove(), children, etc).

- setProperty + setProperties, cf :
    - 1 mixins to modify the "default" instance type
    - then use this in templates...
[Playground Link](https://www.typescriptlang.org/play/?#code/C4TwDgpgBAYg9nAPAFShAHsCA7AJgZygCUIBjOAJ10X2AoEtsBzAGigENsQA+bqAXiiIA0mkw4CUANYQQcAGZRk3ABTZ2AWwgAuKMLYA3dgBtdyANrCAugEoBfA3Hq4A3ACg3pY+3yEAglBQAN5ugYEAxPIArlEqdkEAvqFhYBRwWKRYuFDy7OxxwUnJgX4AhLpBAETkxpSVurQMzAnuYVBMEMBQAEJxusAAFvT45pV+lVbBUBSdURTYUIPDo+OTRW3yCLrwSEsjYxN8ggX8fIluRV4+hN1iWHj+wcVQAYJVNXW6lTO4lRyE5GwtBaFw80WwmXocAWuXYKDuEkIQWwEAA7ioAHRY9gUJj4XScEDmWwErgJVTdHw6JTxZ4zYBzBZXXwIh49KlPNptV7BapwWoUepQb4QX7-KCA4GtMJJIoAejlUAAAsB8ABaehMbCUCCebwsgDCrMksJUflpGxiBRCXLCewxpps0sCso8kq6ACMBFAUaienF3B6HQgVHyBZU2JVKJwOpUnW4g5s4KGPhHhdHmBA4+5PNDaBLvb6oAaA55g8mw3VIxnY-HSOWU-y4GmoxQY1n4245QAqXNAz2FtH++OJkOVeSCyMe7ykKTZtzduVAA)

## Performances

- onUpdate : check if pending.
- getParsedData : use cache ?