## Features

- 5/8 curves to add (?)
- get tests ?

- scale : beforeUpdate()

## Interactive

- name + get component/dataset by name ?

- 3 components to add (zoom, datalabel, tooltip)
- onRemove()
- Update ChartHTML

## Usage

- properties = null => set default.
- setProperty + setProperties

- doc (ofc)
- other node manipulation fonctions (.remove(), children, etc).

- Line constructor : move out somehow ?
    - how to generalize / reuse ???
        -> name of the props
        -> how to distinguish props ?

## Performances

- onUpdate : check if pending.
- getParsedData : use cache ?
- copy-on-write ? (overkill for simple components ?)

Copy on write
=============
-> Component <-> logic (?)
    -> Fct can be called with new...
        -> onInsert(g)
        -> onUpdate(g)
        -> internal "data" (potentially)
        -> Properties are forwarded ?
    -> could have additional props...
-> Sync
    -> Graph <- SHost (RO) <-> SRef (act like graph, signalSync) <-> Component.clone()
    -> Graph <- SHost (RO) <-> SRef (signal sync) <-> logic.clone() ?