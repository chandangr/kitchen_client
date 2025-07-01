export interface WebsiteData {
  id: string;
  created_at: string;
  website_name: string;
  website_subtitle: string;
  description: string;
  about_us: string;
  website_logo: string;
  user_id: string;
  website_data: {
    headerSection: {
      title: string;
      subtitle: string;
      description: string;
      headerBackground: string;
      companyLogo: string;
      titleColor: string;
      subtitleColor: string;
      descriptionColor: string;
    };
    introSection: {
      introTitle: string;
      introDescription: string;
      introMedia: string;
      introTitleColor: string;
      introDescriptionColor: string;
    };
    introMediaSection: {
      introImage: string;
    };
    featuredMenuSection: {
      featuredTitle: string;
      featuredDescription: string;
      featuredImage: string;
      featuredTitleColor: string;
      featuredDescriptionColor: string;
    };
    footerSection: {
      location: string;
      instagram: string;
      facebook: string;
    };
  };
}

export interface UploadFileResponse {
  path: string;
  url: string;
}
