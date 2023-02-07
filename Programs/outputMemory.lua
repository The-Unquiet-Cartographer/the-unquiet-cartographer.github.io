--Written with Lua version 5.1 (lua51.dll)
    emu.pause()

    outputFile = "output.txt"
    mem_start = 0x02000000      --First address in ARM9 memory
    mem_end = 0x02FFFFFF        --Final address in ARM9 memory.
    incr_block = 256            --You can write the increments in decimal if you like. Just remember that there's 16 bytes to a line (not 10, doofus!)
                                --16 == 0x0F in hex. 256 == 0x0100 in hex, but 255 == 0xFF in hex.
    --mem_end = 0x020000FF        --Foreshortened end point for testing purposes.

    print ("writing to "..outputFile)
    file = io.open(outputFile, "w")

--Block-by-block
    for block_start = mem_start, mem_end, incr_block do
        block_end = math.min(block_start+incr_block, mem_end)
        str_block = ""

    --Line-by-line (10 bytes per line)
        for line_start = block_start, block_end, 16 do
            str_line = string.format("%08x", line_start)
            for i=0x00, 16 do str_line = str_line.." "..string.format("%02x", memory.readbyte(line_start+i)) end
            str_block = str_block..str_line.."\n"
        end 
        --print(str_block)
        file:write(str_block)
    end
    file:close()


----------------------------------------------------------------------------------------------------

--NOTES
--[[
    memory.writebyte(int addr, int value)   --one byte
    memory.writeword                        --two bytes
    memory.writedword                       --four bytes
    -- Memory is read in blocks, so incrementing the address will still read the value in that block.
    -- e.g. [B2 10 | C0 C1] reading the "dword" at any address will return the full block. Same with half-words.

    -- I don't know why words are read backwards though.

    Memory starts at 0x02000000, ends at 0x02FFFFFF

    Read and format each byte:
        string.format(
            "%02x",                     -- Format as hex, 2 digits (1 byte)
            memory.readbyte(i)
        )
        i=i+0x01                        -- Increment by 1 byte (single memory address)

    Read and format each half-word:
        i=i+0x02
        string.format(
            "%04x",                     -- Format as hex, 4 digits (2 bytes)
            memory.readword(i)
        )
        i=i+0x02                        -- Increment by 2 bytes

    Read and format each full word:
        string.format(
            "%08x",                     -- Format as hex, 8 digits (4 bytes)
            memory.readdword(i)         -- Thats "read-d-word", not "read-word"
        )
        i=i+0x04                        -- Increment by 4 bytes

    Lua for loop:
        for i=1, 10 do print(i) end     --Increments by +1 unless specified
    OR  for i=1, 10, 1 do print(i) end  
    C# ==:
        for (int i = 1; i < 11; i++) console.log(i);
]]