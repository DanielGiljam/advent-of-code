fn between_1_and_3(x: i32, y: i32) -> bool {
    let diff = y - x;
    diff.abs() >= 1 && diff.abs() <= 3
}

fn is_safe(report: &&Vec<i32>) -> bool {
    let mut increasing = None;
    for i in 0..report.len() - 1 {
        let x = report[i];
        let y = report[i + 1];
        let diff = y - x;
        if !between_1_and_3(x, y) {
            return false;
        }
        let _increasing = diff > 0;
        if increasing.is_none() {
            increasing = Some(_increasing);
        } else if increasing.unwrap() != _increasing {
            return false;
        }
    }
    true
}

#[tracing::instrument]
pub fn process(input: &str) -> miette::Result<String> {
    let mut reports = vec![];
    for line in input.lines() {
        reports.push(
            line.split_whitespace()
                .map(|x| x.parse::<i32>().unwrap())
                .collect::<Vec<i32>>(),
        );
    }
    let safe_count = reports.iter().filter(is_safe).count();
    return Ok(safe_count.to_string());
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process() -> miette::Result<()> {
        let input = "7 6 4 2 1
                           1 2 7 8 9
                           9 7 6 2 1
                           1 3 2 4 5
                           8 6 4 4 1
                           1 3 6 7 9";
        assert_eq!("2", process(input)?);
        Ok(())
    }
}
