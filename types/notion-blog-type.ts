export interface DateProperty {
  id: string;
  type: string;
  date: {
    start: string;
    end: string | null;
    time_zone: string | null;
  }
}

export interface CheckboxProperty {
  id: string;
  type: string;
  checkbox: boolean;
}

export interface Text {
  type: string;
  text: {
    content: string;
    link: string | null;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: string | null;
}

export interface TitleProperty {
  id: string;
  type: string;
  title: Text[];
}

export interface MultiSelectProperty {
  id: string;
  type: string;
  multi_select: MultiSelectIndividualProperty[]; 
}

export interface MultiSelectIndividualProperty{
  id: string;
  name: string;
  color: string;
}

export interface User {
  object: string;
  id: string;
}

export interface Parent {
  type: string;
  database_id: string;
}

export interface PageProperties {
  Date: DateProperty;
  Published: CheckboxProperty;
  Name: TitleProperty;
  Tag: MultiSelectProperty;
}

export interface Page {
  object: string;
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: User;
  last_edited_by: User;
  cover: null | string;
  icon: null | string;
  parent: Parent;
  archived: boolean;
  properties: PageProperties;
  url: string;
  public_url: null | string;
}
