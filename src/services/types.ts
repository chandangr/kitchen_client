export interface WebsiteData {
  id?: string;
  user_id: string;
  header: {
    title: string;
    subtitle: string;
    description: string;
    headerBackground: string;
    companyLogo: string;
    titleColor: string;
    subtitleColor: string;
    descriptionColor: string;
  };
  intro: {
    introTitle: string;
    introDescription: string;
    introMedia: string;
    introTitleColor: string;
    introDescriptionColor: string;
  };
  introMediaSection: {
    introImage: string;
  };
  featured: {
    featuredTitle: string;
    featuredDescription: string;
    featuredImage: string;
    featuredTitleColor: string;
    featuredDescriptionColor: string;
  };
  footer: {
    location: string;
    instagram: string;
    facebook: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface UploadFileResponse {
  path: string;
  url: string;
}
