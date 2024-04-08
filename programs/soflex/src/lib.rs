use anchor_lang::prelude::*;

declare_id!("6J7PCVvgJWDwkUqYPqHATRcKfdTUQsge4dFQ9YMu858f");

#[program]
pub mod soflex {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
