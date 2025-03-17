// TODO: add proper types

export default function saveTextBlocks(
 inputRefs: any,
 blocks: any,
 setBlocks: any,
 loading: boolean,
 setLoading: any
) {
 setLoading(false);

 const updatedBlocks = blocks.map((block: any) => {
  if (block.type !== "calendar") {
   const inputRef = inputRefs.current[block.id];

   if (inputRef) {
    block.data.text = inputRef.innerText;
   }
  }
  return block;
 });

 console.log(updatedBlocks);
 setBlocks(updatedBlocks);
 setLoading(true);

 return { success: true };
}