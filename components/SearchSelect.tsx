import { Router, RouteRounded } from '@mui/icons-material'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import router from 'next/router'
import { useEffect, useState, FC, Dispatch, SetStateAction } from 'react'

interface Props {
  name: string
  labelTitle: string
  optionList: { items? }
  selected: string
  isInSlug?: boolean
  pathname: string
}

export const SearchSelect: FC<Props> = ({
  name,
  labelTitle,
  optionList,
  selected,
  isInSlug,
  pathname,
}) => {
  const [selection, setSelection] = useState(
   selected
  );
  const handleChange = (event: SelectChangeEvent) => {
    if(event.target.value != "") setSelection(event.target.value as string)
  }

  useEffect(() => {
    console.log(selection)
    if(selection !=""){
      switch(name){
        case 'tagSelect':
          router.push({
            pathname: pathname + '/tag/' + selection
          })
          break
        case 'monthSelect':
          router.push({
            pathname: pathname + '/month/' + selection
          })
          break
      }
    }
  }, [selection])

  return (
    <FormControl fullWidth>
      <InputLabel id={`searchSelect${name}`}>{labelTitle}</InputLabel>
      <Select
        labelId={`searchSelect${name}`}
        value={selection}
        label={labelTitle}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>選択しない</em>
        </MenuItem>
        {
          Object.keys(optionList).map((key) => {
            return (
              <MenuItem key={key} value={key.replace("/", "")}>
                {key + " (" + optionList[key].length + ")"}
              </MenuItem>
            )
          })
        }
      </Select>
    </FormControl>
  )
}
