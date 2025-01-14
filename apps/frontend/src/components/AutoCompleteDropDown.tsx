import React from "react";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from "./ui/dropdown";

type Props = {
 autoCompleteWords: {
  title: string;
  description: string;
 }[];

 term: string;
};

export default function AutoCompleteDropDown({
 autoCompleteWords,
 term,
}: Props) {
 return (
  <DropdownMenu open={true}>
   <DropdownMenuTrigger>
   </DropdownMenuTrigger>
   <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem>Subscription</DropdownMenuItem>
   </DropdownMenuContent>
  </DropdownMenu>
 );
}
