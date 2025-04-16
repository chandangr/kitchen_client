import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { FileItem, isFile } from "./ui/file-upload";
import { Label } from "./ui/label";

// Define props interface
interface ThreeDCardProps {
  title?: string;
  titleBadge?: string;
  tags?: string[];
  description?: string;
  imageUrl: string | FileItem;
  tourLink?: string;
  buttonText: string;
  descriptionList?: {
    title: string;
    value: string;
  }[];
  translateZ?: string;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

// Update the component to accept props
export function ThreeDCard({
  title,
  description,
  titleBadge,
  tags,
  imageUrl,
  descriptionList,
  translateZ = "10",
  showActions = false,
  onEdit,
  onDelete,
}: ThreeDCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    setIsDialogOpen(false);
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <CardContainer>
      <CardBody className="bg-gray-50 relative dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto h-auto rounded-xl p-6 border">
        <div className="flex justify-between items-center">
          <CardItem
            translateZ={translateZ}
            className="text-xl font-bold text-neutral-600 dark:text-white"
          >
            {title}
          </CardItem>
          {titleBadge && (
            <CardItem
              translateZ={translateZ}
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              <Badge>{titleBadge}</Badge>
            </CardItem>
          )}
        </div>
        {descriptionList?.map((description) => {
          return (
            <div className="flex justify-between items-center">
              <Label>{description?.title}</Label>
              <CardItem
                translateZ={translateZ}
                as="button"
                className="px-4 py-2 dark:bg-white dark:text-black text-black text-xs font-bold"
              >
                {description?.value}
              </CardItem>
            </div>
          );
        })}
        <CardItem translateZ={translateZ} className="w-[100%]">
          <motion.img
            src={!isFile(imageUrl) ? imageUrl : URL.createObjectURL(imageUrl)}
            width="1000"
            className="h-60 object-contain rounded-xl group-hover/card:shadow-xl"
            alt={title}
          />
        </CardItem>
        <div className="flex flex-wrap">
          {tags?.map((tag) => {
            return (
              <CardItem
                translateZ={translateZ}
                className="px-2 py-1 dark:bg-white dark:text-black text-black text-xs font-bold"
              >
                <Badge variant="outline">{`#${tag}`}</Badge>
              </CardItem>
            );
          })}
        </div>
        <CardItem
          as="p"
          translateZ={translateZ}
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          {description}
        </CardItem>
        {showActions && (
          <div className="absolute bottom-4 right-4">
            <Popover>
              <PopoverTrigger>
                <MoreHorizontal className="cursor-pointer text-gray-500 hover:text-gray-700" />
              </PopoverTrigger>
              <PopoverContent className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="flex gap-4">
                  <Label
                    onClick={onEdit}
                    className="cursor-pointer flex items-center"
                    htmlFor="edit"
                  >
                    <Edit className="inline mr-1 h-4 w-4" /> Edit
                  </Label>
                  <Label
                    onClick={() => setIsDialogOpen(true)}
                    className="cursor-pointer flex items-center font-bold text-red-500 dark:text-white"
                    htmlFor="delete"
                  >
                    <Trash className="inline mr-1 h-4 w-4" /> Delete
                  </Label>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </CardBody>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Dish</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              dish and remove data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDelete}>Delete</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CardContainer>
  );
}
