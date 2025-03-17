import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { HeroBackgroundSection } from "./HeroBackgroundSection";
import { ThreeDCard } from "./ThreeDCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface WebsiteBuilderProps {
  headerSection: {
    title: string;
    subtitle: string;
    description: string;
    headerBackground: string;
    companyLogo: string;
  };
  introSection: {
    introTitle: string;
    introDescription: string;
    introMedia: string;
  };
  introMediaSection: {
    introImage: string;
  };
  featuredMenuSection: {
    featuredTitle: string;
    featuredDescription: string;
    featuredImage: string;
  };
  footerSection: {
    location: string;
    instagram: string;
    facebook: string;
  };
}

const WebsiteBuilder = (props: WebsiteBuilderProps) => {
  const {
    headerSection,
    introSection,
    introMediaSection,
    featuredMenuSection,
    footerSection,
  } = props;

  const [state, setState] = useState({
    header: {
      ...headerSection,
      titleColor: "#000000",
      subtitleColor: "#000000",
      descriptionColor: "#000000",
    },
    intro: {
      ...introSection,
      introMedia: introSection?.introMedia,
      introTitleColor: "#000000",
      introDescriptionColor: "#000000",
    },
    introMediaSection: introMediaSection,
    featured: {
      ...featuredMenuSection,
      featuredTitleColor: "#000000",
      featuredDescriptionColor: "#000000",
    },
    footer: footerSection,
    isPreview: false,
  });

  useEffect(() => {
    // @ts-expect-error -- commented out because of the error
    setState((prevState) => ({
      ...prevState,
      header: { ...headerSection },
      intro: { ...introSection },
      introMediaSection: { ...introMediaSection },
      featured: { ...featuredMenuSection },
      footer: { ...footerSection },
    }));
  }, [
    headerSection,
    introSection,
    introMediaSection,
    featuredMenuSection,
    footerSection,
  ]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof state
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState((prevState) => ({
          ...prevState,
          [key.split(".")[0]]: {
            // @ts-expect-error -- commented out because of the error
            ...prevState?.[key?.split(".")?.[0]],
            [key.split(".")[1]]: reader.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePreview = () => {
    setState((prevState) => ({
      ...prevState,
      isPreview: !prevState.isPreview,
    }));
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-2 justify-between">
        <div>
          <h1 className="text-2xl font-bold">Webiste Builder</h1>
        </div>
        <div className="flex justify-end mb-4">
          <Button onClick={togglePreview}>
            {state.isPreview ? "Exit Preview" : "Preview"}
          </Button>
          <Button className="ml-2">Save & publish</Button>
        </div>
      </div>
      <div className="flex">
        {!state.isPreview && (
          <div className="w-1/3 p-4 h-400px">
            <Accordion type="single" collapsible>
              <AccordionItem value="header">
                <AccordionTrigger>Header</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent>
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold">Visuals</h3>
                        <div className="mt-2">
                          <label className="block text-sm font-medium">
                            Company logo
                          </label>
                          <Input
                            type="file"
                            onChange={(e) =>
                              // @ts-expect-error -- commented out because of the error
                              handleFileChange(e, "header.companyLogo")
                            }
                          />
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm font-medium">
                            Header background
                          </label>
                          <Input
                            type="file"
                            onChange={(e) =>
                              // @ts-expect-error -- commented out because of the error
                              handleFileChange(e, "header.headerBackground")
                            }
                          />
                        </div>
                        <h3 className="text-lg font-semibold mt-4">Text</h3>
                        <div className="mt-2">
                          <label className="block text-sm font-medium">
                            Subtitle (optional)
                          </label>
                          <Input
                            value={state.header.subtitle}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                header: {
                                  ...prev.header,
                                  subtitle: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm font-medium">
                            Title *
                          </label>
                          <Input
                            value={state.header.title}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                header: {
                                  ...prev.header,
                                  title: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm font-medium">
                            Description (optional)
                          </label>
                          <Input
                            value={state.header.description}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                header: {
                                  ...prev.header,
                                  description: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold">
                            Appearance settings
                          </h3>
                          <div className="flex gap-4">
                            <div className="mt-2">
                              <label className="block text-sm font-medium">
                                Title Color
                              </label>
                              <input
                                type="color"
                                value={state.header.titleColor}
                                onChange={(e) =>
                                  setState((prev) => ({
                                    ...prev,
                                    header: {
                                      ...prev.header,
                                      titleColor: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                            <div className="mt-2">
                              <label className="block text-sm font-medium">
                                Subtitle Color
                              </label>
                              <input
                                type="color"
                                value={state.header.subtitleColor}
                                onChange={(e) =>
                                  setState((prev) => ({
                                    ...prev,
                                    header: {
                                      ...prev.header,
                                      subtitleColor: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                            <div className="mt-2">
                              <label className="block text-sm font-medium">
                                Description Color
                              </label>
                              <input
                                type="color"
                                value={state.header.descriptionColor}
                                onChange={(e) =>
                                  setState((prev) => ({
                                    ...prev,
                                    header: {
                                      ...prev.header,
                                      descriptionColor: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="intro">
                <AccordionTrigger>Introduction</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent>
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mt-4">Text</h3>
                        <div className="mt-2">
                          <label className="block text-sm font-medium">
                            Title
                          </label>
                          <Input
                            value={state.intro.introTitle}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                intro: {
                                  ...prev.intro,
                                  introTitle: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm font-medium">
                            Description
                          </label>
                          <Input
                            value={state.intro.introDescription}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                intro: {
                                  ...prev.intro,
                                  introDescription: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <h3 className="text-lg font-semibold">Visuals</h3>
                        <div className="mt-2">
                          <label className="block text-sm font-medium">
                            Image/Video
                          </label>
                          <Input
                            type="file"
                            onChange={(e) =>
                              // @ts-expect-error -- commented out because of the error
                              handleFileChange(e, "intro.introMedia")
                            }
                          />
                        </div>
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold">
                            Appearance settings
                          </h3>
                          <div className="flex gap-4">
                            <div className="mt-2">
                              <label className="block text-sm font-medium">
                                Title Color
                              </label>
                              <input
                                type="color"
                                value={state.intro.introTitleColor}
                                onChange={(e) =>
                                  setState((prev) => ({
                                    ...prev,
                                    intro: {
                                      ...prev.intro,
                                      introTitleColor: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                            <div className="mt-2">
                              <label className="block text-sm font-medium">
                                Description Color
                              </label>
                              <input
                                type="color"
                                value={state.intro.introDescriptionColor}
                                onChange={(e) =>
                                  setState((prev) => ({
                                    ...prev,
                                    intro: {
                                      ...prev.intro,
                                      introDescriptionColor: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="introImage">
                <AccordionTrigger>Introduction Image</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent>
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold">Visuals</h3>
                        <div className="mt-2">
                          <label className="block text-sm font-medium">
                            Image
                          </label>
                          <Input
                            type="file"
                            onChange={(e) =>
                              // @ts-expect-error -- commented out because of the error
                              handleFileChange(e, "intro.introImage")
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="featuredMenu">
                <AccordionTrigger>Featured Menu</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent>
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mt-4">Text</h3>
                        <div className="mt-2">
                          <label className="block text-sm font-medium">
                            Title
                          </label>
                          <Input
                            value={state.featured.featuredTitle}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                featured: {
                                  ...prev.featured,
                                  featuredTitle: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm font-medium">
                            Description
                          </label>
                          <Input
                            value={state.featured.featuredDescription}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                featured: {
                                  ...prev.featured,
                                  featuredDescription: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <h3 className="text-lg font-semibold">Visuals</h3>
                        <div className="mt-2">
                          <label className="block text-sm font-medium">
                            Image
                          </label>
                          <Input
                            type="file"
                            onChange={(e) =>
                              // @ts-expect-error -- commented out because of the error
                              handleFileChange(e, "featured.featuredImage")
                            }
                          />
                        </div>
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold">
                            Appearance settings
                          </h3>
                          <div className="flex gap-4">
                            <div className="mt-2">
                              <label className="block text-sm font-medium">
                                Title Color
                              </label>
                              <input
                                type="color"
                                value={state.featured.featuredTitleColor}
                                onChange={(e) =>
                                  setState((prev) => ({
                                    ...prev,
                                    featured: {
                                      ...prev.featured,
                                      featuredTitleColor: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                            <div className="mt-2">
                              <label className="block text-sm font-medium">
                                Description Color
                              </label>
                              <input
                                type="color"
                                value={state.featured.featuredDescriptionColor}
                                onChange={(e) =>
                                  setState((prev) => ({
                                    ...prev,
                                    featured: {
                                      ...prev.featured,
                                      featuredDescriptionColor: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="footer">
                <AccordionTrigger>Footer</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent>
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mt-4">Text</h3>
                        <div className="mt-2">
                          <label className="block text-sm font-medium">
                            Location
                          </label>
                          <Input
                            value={state.footer.location}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                footer: {
                                  ...prev.footer,
                                  location: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm font-medium">
                            Instagram
                          </label>
                          <Input
                            value={state.footer.instagram}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                footer: {
                                  ...prev.footer,
                                  instagram: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm font-medium">
                            Facebook
                          </label>
                          <Input
                            value={state.footer.facebook}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                footer: {
                                  ...prev.footer,
                                  facebook: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
        <div
          className={`h-full ${state.isPreview ? "w-full p-4" : "w-2/3 p-4"}`}
        >
          <div
            className={`relative p-4 bg-white rounded ${
              state.isPreview ? "h-screen" : "h-[70vh]"
            }`}
          >
            <HeroBackgroundSection
              title={state.header.title}
              titleColor={state.header.titleColor}
              subtitleColor={state.header.subtitleColor}
              subtitleText={state.header.subtitle}
              descriptionColor={state.header.descriptionColor}
              descriptionText={state.header.description}
              companyLogo={state.header.companyLogo}
              backgroundImage={state.header.headerBackground}
            />
          </div>
          <div
            className={`p-4 bg-white rounded flex ${
              state.isPreview ? "mt-[4rem]" : "mt-[18rem]"
            }`}
          >
            <div
              className={`w-1/2 ${state.isPreview ? "h-[60vh]" : "h-[40vh]"}`}
            >
              <h2
                className="text-2xl font-bold"
                style={{ color: state.intro.introTitleColor }}
              >
                {state.intro.introTitle}
              </h2>
              <p
                className="mt-4"
                style={{ color: state.intro.introDescriptionColor }}
              >
                {state.intro.introDescription}
              </p>
              <Button className="mt-4">Read More</Button>
            </div>
            <div className="w-1/3 flex justify-center items-center">
              {state.intro.introMedia && (
                <ThreeDCard
                  buttonText="Read More"
                  imageUrl={state.intro.introMedia}
                />
              )}
            </div>
          </div>
          {state?.introMediaSection?.introImage && (
            <a href="#" className="block mt-4">
              <div
                className={`w-full h-96 bg-cover bg-center ${
                  state.isPreview ? "h-screen" : "h-[70vh]"
                }`}
                style={{
                  backgroundImage: `url(${state?.introMediaSection?.introImage})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              ></div>
            </a>
          )}
          {state.featured.featuredImage && (
            <div
              className={`p-4 bg-white rounded mt-4 flex ${
                state.isPreview ? "h-[80vh]" : "h-[60vh]"
              }`}
            >
              <div className="w-1/2">
                <h2
                  className="text-2xl font-bold"
                  style={{ color: state.featured.featuredTitleColor }}
                >
                  {state.featured.featuredTitle}
                </h2>
                <p
                  className="mt-4"
                  style={{ color: state.featured.featuredDescriptionColor }}
                >
                  {state.featured.featuredDescription}
                </p>
                <Button
                  className="mt-4"
                  onClick={() => (window.location.href = "#")}
                >
                  Full Menu
                </Button>
              </div>
              <div className="w-1/2 flex justify-center items-center">
                <motion.img
                  src={state.featured.featuredImage}
                  alt="Featured Menu"
                  className="mt-4"
                />
              </div>
            </div>
          )}
          <div className="p-4 bg-black text-white rounded shadow mt-4 flex justify-between">
            <div>
              <h3 className="text-lg font-semibold">QUICK LINKS</h3>
              <ul className="mt-2">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Refund Policy</li>
                <li>Shipping Policy</li>
                <li>Terms and Conditions</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">LOCATION</h3>
              <p className="mt-2">{state.footer.location}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">WE ARE SOCIAL</h3>
              <div className="mt-2 flex space-x-4">
                <a
                  href={state.footer.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
                <a
                  href={state.footer.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </div>
              <Button className="mt-4">Leave Us Your Feedback</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilder;
