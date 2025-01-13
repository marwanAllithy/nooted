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
  if (block.type !== "calender") {
   const inputRef = inputRefs.current[block.id];

   block.data.text = inputRef.innerText;
  }
 });

 console.log(blocks);
 setBlocks(updatedBlocks);
 setLoading(true);

 return { success: true };
}
